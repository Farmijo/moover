'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { moveService, userTaskService, roomService } from '@/lib/services';
import { Move, TaskSummary, UserTask, Room } from '@/types/api';

// Extended UserTask type for priority calculation
type PriorityUserTask = UserTask & {
  priorityScore: number;
  urgencyReason: string;
  targetDate: Date | null;
  daysFromNow: number;
};

// Utility function to get days until a date
const getDaysUntilDate = (date: string | null): number => {
  if (!date) return 999;
  const targetDate = new Date(date);
  const today = new Date();
  const diffTime = targetDate.getTime() - today.getTime();
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
};

// Format date for display
const formatDate = (date: string | null): string => {
  if (!date) return '';
  return new Date(date).toLocaleDateString('es-ES', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });
};

// Get relative date text
const getRelativeDate = (date: string | null): string => {
  if (!date) return '';
  const days = getDaysUntilDate(date);
  if (days < 0) return `Hace ${Math.abs(days)} días`;
  if (days === 0) return 'Hoy';
  if (days === 1) return 'Mañana';
  if (days <= 7) return `En ${days} días`;
  return `En ${days} días`;
};

export default function DashboardPage() {
  const [currentMove, setCurrentMove] = useState<Move | null>(null);
  const [taskSummary, setTaskSummary] = useState<TaskSummary | null>(null);
  const [priorityTasks, setPriorityTasks] = useState<PriorityUserTask[]>([]);
  const [allUserTasks, setAllUserTasks] = useState<UserTask[]>([]);
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true);
  const [generatingTasks, setGeneratingTasks] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // Calculate priority tasks based on move timeline
  const calculatePriorityTasks = (userTasks: UserTask[], move: Move): PriorityUserTask[] => {
    const now = new Date();
    const moveOutDate = move.origin_move_out_date ? new Date(move.origin_move_out_date) : null;
    const keyDeliveryDate = move.destination_key_delivery_date ? new Date(move.destination_key_delivery_date) : null;
    
    // Filter only incomplete tasks
    const incompleteTasks = userTasks.filter(task => !task.completed);
    
    // Calculate priority score for each task
    const tasksWithPriority = incompleteTasks.map(task => {
      let priorityScore = 0;
      let urgencyReason = '';
      
      // Base timing from task (negative means before move, positive means after)
      const taskTiming = task.task?.timing || 0;
      
      // Calculate target date for this task
      let targetDate: Date | null = null;
      if (moveOutDate) {
        // If timing is negative, it should be done before move out
        // If timing is positive, it should be done after key delivery (if available) or move out
        if (taskTiming <= 0) {
          targetDate = new Date(moveOutDate.getTime() + taskTiming * 24 * 60 * 60 * 1000);
        } else {
          const referenceDate = keyDeliveryDate || moveOutDate;
          targetDate = new Date(referenceDate.getTime() + taskTiming * 24 * 60 * 60 * 1000);
        }
      }
      
      if (targetDate) {
        const daysUntilTarget = Math.ceil((targetDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
        
        // Higher priority score means more urgent
        if (daysUntilTarget < 0) {
          // Overdue tasks get highest priority
          priorityScore = 1000 + Math.abs(daysUntilTarget);
          urgencyReason = `Vencida hace ${Math.abs(daysUntilTarget)} días`;
        } else if (daysUntilTarget <= 3) {
          // Tasks due in next 3 days get high priority
          priorityScore = 500 + (3 - daysUntilTarget) * 100;
          urgencyReason = `Vence en ${daysUntilTarget} ${daysUntilTarget === 1 ? 'día' : 'días'}`;
        } else if (daysUntilTarget <= 7) {
          // Tasks due in next week get medium priority
          priorityScore = 300 + (7 - daysUntilTarget) * 10;
          urgencyReason = `Vence en ${daysUntilTarget} días`;
        } else {
          // Future tasks get lower priority, but earlier timing gets higher priority
          priorityScore = Math.max(1, 100 - daysUntilTarget);
          urgencyReason = `Planificar para dentro de ${daysUntilTarget} días`;
        }
      } else {
        // Tasks without clear timeline get medium priority
        priorityScore = 50;
        urgencyReason = 'Sin fecha específica';
      }
      
      return {
        ...task,
        priorityScore,
        urgencyReason,
        targetDate,
        daysFromNow: targetDate ? Math.ceil((targetDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)) : 999
      };
    });
    
    // Sort by priority score (highest first) and return top 3
    return tasksWithPriority
      .sort((a, b) => b.priorityScore - a.priorityScore)
      .slice(0, 3);
  };

  // Check if tasks can be generated (requires origin key delivery date)
  const canGenerateTasks = (move: Move | null): boolean => {
    if (!move) return false;
    return !!move.origin_key_delivery_date;
  };

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        // Get current move
        const moveResponse = await moveService.getCurrentMove();
        setCurrentMove(moveResponse.move);

        // If there's a current move, get task summary, priority tasks, and rooms
        if (moveResponse.move) {
          try {
            const [summaryResponse, userTasksResponse, roomsResponse] = await Promise.all([
              userTaskService.getTaskSummary(moveResponse.move.id),
              userTaskService.getUserTasks(moveResponse.move.id),
              roomService.getRooms(moveResponse.move.id)
            ]);
            
            setTaskSummary(summaryResponse);
            setRooms(roomsResponse);
            setAllUserTasks(userTasksResponse);
            
            // Calculate priority tasks based on timeline
            const priorityTasks = calculatePriorityTasks(userTasksResponse, moveResponse.move);
            setPriorityTasks(priorityTasks);
          } catch (summaryError) {
            console.error('Error loading task summary:', summaryError);
            // Don't set error for task summary, just continue without it
          }
        }
      } catch (err) {
        console.error('Error loading dashboard:', err);
        setError('Error al cargar los datos del dashboard');
      } finally {
        setLoading(false);
      }
    };

    loadDashboardData();
  }, []);

  const handleToggleTask = async (taskId: number, completed: boolean) => {
    if (!currentMove) return;
    
    try {
      await userTaskService.updateUserTask(currentMove.id, taskId, { completed });
      
      // Recargar datos del dashboard
      const [summaryResponse, userTasksResponse] = await Promise.all([
        userTaskService.getTaskSummary(currentMove.id),
        userTaskService.getUserTasks(currentMove.id)
      ]);
      
      setTaskSummary(summaryResponse);
      setAllUserTasks(userTasksResponse);
      
      // Recalcular tareas prioritarias
      const updatedPriorityTasks = calculatePriorityTasks(userTasksResponse, currentMove);
      setPriorityTasks(updatedPriorityTasks);
      
      if (completed) {
        setSuccessMessage('Tarea marcada como completada');
      } else {
        setSuccessMessage('Tarea desmarcada');
      }
      
      // Ocultar el mensaje después de 3 segundos
      setTimeout(() => {
        setSuccessMessage('');
      }, 3000);
    } catch (err) {
      console.error('Error updating task:', err);
      setError('Error al actualizar la tarea');
    }
  };

  const handleGenerateTasks = async () => {
    if (!currentMove) return;
    
    // Validar que la fecha de entrega de llaves del origen esté definida
    if (!currentMove.origin_key_delivery_date) {
      setError('Para generar tareas es necesario definir la fecha de entrega de llaves del piso de origen.');
      return;
    }
    
    try {
      setError('');
      setSuccessMessage('');
      setGeneratingTasks(true);
      
      const result = await moveService.generateTasks(currentMove.id);
      
      // Recargar el resumen de tareas y tareas prioritarias
      const [summaryResponse, userTasksResponse] = await Promise.all([
        userTaskService.getTaskSummary(currentMove.id),
        userTaskService.getUserTasks(currentMove.id)
      ]);
      
      setTaskSummary(summaryResponse);
      setAllUserTasks(userTasksResponse);
      
      // Recalcular tareas prioritarias
      const priorityTasks = calculatePriorityTasks(userTasksResponse, currentMove);
      setPriorityTasks(priorityTasks);
      
      setSuccessMessage(`Se generaron ${result.tasks_count} tareas correctamente`);
      
      // Ocultar el mensaje de éxito después de 5 segundos
      setTimeout(() => {
        setSuccessMessage('');
      }, 5000);
    } catch (err) {
      console.error('Error generating tasks:', err);
      setError('Error al generar tareas');
    } finally {
      setGeneratingTasks(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
        {error}
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="mt-2 text-lg text-gray-600">
          Estado general de tu mudanza
        </p>
      </div>

      {/* Messages */}
      {error && (
        <div className="mb-6 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      {successMessage && (
        <div className="mb-6 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
          ✅ {successMessage}
        </div>
      )}

      {/* Warning when cannot generate tasks */}
      {currentMove && !canGenerateTasks(currentMove) && (
        <div className="mb-6 bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded">
          ⚠️ Para generar y calcular las tareas correctamente, es necesario definir la fecha de entrega de llaves del piso de origen.{' '}
          <Link
            href={`/dashboard/moves/${currentMove.id}`}
            className="font-medium underline hover:no-underline"
          >
            Configurar fechas →
          </Link>
        </div>
      )}

      {!currentMove ? (
        // No current move - show getting started
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="px-6 py-12 text-center">
            <div className="w-16 h-16 mx-auto mb-4 bg-indigo-100 rounded-full flex items-center justify-center">
              <span className="text-2xl">🏠</span>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              ¡Comienza tu primera mudanza!
            </h3>
            <p className="text-gray-600 mb-6 max-w-md mx-auto">
              No tienes ninguna mudanza activa. Crea una nueva mudanza para empezar 
              a organizar tu proceso de mudanza.
            </p>
            <Link
              href="/dashboard/moves/new"
              className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700"
            >
              <span className="mr-2">+</span>
              Crear nueva mudanza
            </Link>
          </div>
        </div>
      ) : (
        <div className="space-y-8">
          {/* 1. 👋 Estado actual */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="px-6 py-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center">
                    <span className="text-2xl">🏠</span>
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900">
                      Mudanza a {currentMove.destination_address.split(',')[0]}
                    </h2>
                    <div className="flex items-center space-x-4 mt-1">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        currentMove.status === 'planning' 
                          ? 'bg-yellow-100 text-yellow-800'
                          : currentMove.status === 'in_progress'
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-green-100 text-green-800'
                      }`}>
                        {currentMove.status === 'planning' && '📝 Planificando'}
                        {currentMove.status === 'in_progress' && '🚀 En progreso'}
                        {currentMove.status === 'completed' && '✅ Completada'}
                      </span>
                      {taskSummary && (
                        <span className="text-sm text-gray-600">
                          {taskSummary.summary.progress_percentage}% completado ({taskSummary.summary.completed_tasks}/{taskSummary.summary.total_tasks} tareas)
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  {(!taskSummary || taskSummary.summary.total_tasks === 0) && (
                    <button
                      onClick={handleGenerateTasks}
                      disabled={generatingTasks || !canGenerateTasks(currentMove)}
                      className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
                      title={!canGenerateTasks(currentMove) ? 'Se requiere definir la fecha de entrega de llaves del origen' : ''}
                    >
                      {generatingTasks ? '⏳ Generando...' : '⚡ Generar tareas'}
                    </button>
                  )}
                  <Link
                    href={`/dashboard/moves/${currentMove.id}`}
                    className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                  >
                    Ver detalles
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* Key Dates */}
          {(currentMove.origin_move_out_date || currentMove.destination_key_delivery_date || currentMove.origin_key_delivery_date) && (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-medium text-gray-900">📅 Fechas clave</h3>
              </div>
              <div className="px-6 py-4">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                  {currentMove.origin_key_delivery_date && (
                    <div className="text-center p-4 bg-blue-50 rounded-lg">
                      <div className="text-2xl mb-2">🗝️</div>
                      <div className="text-sm font-medium text-gray-900">Entrega llaves origen</div>
                      <div className="text-sm text-gray-600">{formatDate(currentMove.origin_key_delivery_date)}</div>
                      <div className="text-xs text-blue-600 font-medium">{getRelativeDate(currentMove.origin_key_delivery_date)}</div>
                    </div>
                  )}
                  {currentMove.origin_move_out_date && (
                    <div className="text-center p-4 bg-orange-50 rounded-lg">
                      <div className="text-2xl mb-2">📦</div>
                      <div className="text-sm font-medium text-gray-900">Fecha de mudanza</div>
                      <div className="text-sm text-gray-600">{formatDate(currentMove.origin_move_out_date)}</div>
                      <div className="text-xs text-orange-600 font-medium">{getRelativeDate(currentMove.origin_move_out_date)}</div>
                    </div>
                  )}
                  {currentMove.destination_key_delivery_date && (
                    <div className="text-center p-4 bg-green-50 rounded-lg">
                      <div className="text-2xl mb-2">🏡</div>
                      <div className="text-sm font-medium text-gray-900">Acceso nuevo hogar</div>
                      <div className="text-sm text-gray-600">{formatDate(currentMove.destination_key_delivery_date)}</div>
                      <div className="text-xs text-green-600 font-medium">{getRelativeDate(currentMove.destination_key_delivery_date)}</div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-8">
              {/* 📋 Lista de tareas prioritarias */}
              {priorityTasks.length > 0 && (
                <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                  <div className="px-6 py-4 border-b border-gray-200">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-medium text-gray-900">🚨 Tareas prioritarias</h3>
                      <Link
                        href={`/dashboard/moves/${currentMove.id}/tasks`}
                        className="text-sm text-indigo-600 hover:text-indigo-500"
                      >
                        Ver todas →
                      </Link>
                    </div>
                  </div>
                  <div className="px-6 py-4 space-y-3">
                    {priorityTasks.slice(0, 5).map((task) => (
                      <div key={task.id} className={`p-4 rounded-lg border-l-4 ${
                        task.daysFromNow < 0 ? 'border-red-400 bg-red-50' :
                        task.daysFromNow <= 3 ? 'border-orange-400 bg-orange-50' :
                        'border-yellow-400 bg-yellow-50'
                      }`}>
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center space-x-2 mb-1">
                              <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                                task.daysFromNow < 0 ? 'bg-red-100 text-red-800' :
                                task.daysFromNow <= 3 ? 'bg-orange-100 text-orange-800' :
                                'bg-yellow-100 text-yellow-800'
                              }`}>
                                {task.urgencyReason}
                              </span>
                              {task.room && (
                                <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                                  🏠 {task.room.name}
                                </span>
                              )}
                            </div>
                            <h4 className="text-sm font-medium text-gray-900">{task.name}</h4>
                            {task.task?.description && (
                              <p className="text-xs text-gray-600 mt-1">{task.task.description}</p>
                            )}
                          </div>
                          <button
                            onClick={() => handleToggleTask(task.id, true)}
                            className="ml-4 inline-flex items-center px-3 py-1 border border-transparent text-xs font-medium rounded text-indigo-700 bg-indigo-100 hover:bg-indigo-200"
                          >
                            ✓ Completar
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Stats Cards */}
              {taskSummary && (
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
                  <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                    <div className="flex items-center">
                      <div className="flex-shrink-0">
                        <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                          <span className="text-green-600 text-sm">✓</span>
                        </div>
                      </div>
                      <div className="ml-4">
                        <p className="text-sm font-medium text-gray-500">Completadas</p>
                        <p className="text-2xl font-semibold text-gray-900">
                          {taskSummary.summary.completed_tasks}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                    <div className="flex items-center">
                      <div className="flex-shrink-0">
                        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                          <span className="text-blue-600 text-sm">📊</span>
                        </div>
                      </div>
                      <div className="ml-4">
                        <p className="text-sm font-medium text-gray-500">Progreso</p>
                        <p className="text-2xl font-semibold text-gray-900">
                          {taskSummary.summary.progress_percentage}%
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                    <div className="flex items-center">
                      <div className="flex-shrink-0">
                        <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
                          <span className="text-red-600 text-sm">⚠️</span>
                        </div>
                      </div>
                      <div className="ml-4">
                        <p className="text-sm font-medium text-gray-500">Atrasadas</p>
                        <p className="text-2xl font-semibold text-gray-900">
                          {taskSummary.summary.overdue_tasks}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Sidebar */}
            <div className="space-y-8">
              {/* 🏠 Habitaciones */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                <div className="px-6 py-4 border-b border-gray-200">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-medium text-gray-900">🏠 Habitaciones</h3>
                    <Link
                      href={`/dashboard/moves/${currentMove.id}/rooms/new`}
                      className="text-sm text-indigo-600 hover:text-indigo-500"
                    >
                      + Añadir
                    </Link>
                  </div>
                </div>
                <div className="px-6 py-4">
                  {rooms.length === 0 ? (
                    <div className="text-center py-4">
                      <p className="text-sm text-gray-500 mb-3">No hay habitaciones configuradas</p>
                      <Link
                        href={`/dashboard/moves/${currentMove.id}/rooms/new`}
                        className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                      >
                        + Añadir primera habitación
                      </Link>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {rooms.map((room) => {
                        console.log(room);
                        const roomTasks = allUserTasks.filter(task => task.room_id === room.id);
                        return (
                          <div key={room.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                            <div className="flex-1">
                              <h4 className="text-sm font-medium text-gray-900">{room.name}</h4>
                              <p className="text-xs text-gray-500">{roomTasks.length} tareas</p>
                            </div>
                            <Link
                              href={`/dashboard/moves/${currentMove.id}/rooms/${room.id}`}
                              className="text-xs text-indigo-600 hover:text-indigo-500"
                            >
                              Ver →
                            </Link>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>

              {/* ⚙️ Acciones rápidas */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                <div className="px-6 py-4 border-b border-gray-200">
                  <h3 className="text-lg font-medium text-gray-900">⚙️ Acciones rápidas</h3>
                </div>
                <div className="px-6 py-4 space-y-3">
                  <Link
                    href={`/dashboard/moves/${currentMove.id}/rooms/new`}
                    className="w-full inline-flex items-center justify-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                  >
                    🏠 Añadir habitación
                  </Link>
                  
                  {taskSummary && taskSummary.summary.total_tasks > 0 && (
                    <button
                      onClick={handleGenerateTasks}
                      disabled={generatingTasks || !canGenerateTasks(currentMove)}
                      className="w-full inline-flex items-center justify-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                      title={!canGenerateTasks(currentMove) ? 'Se requiere definir la fecha de entrega de llaves del origen' : ''}
                    >
                      {generatingTasks ? '⏳ Regenerando...' : '🔄 Regenerar tareas'}
                    </button>
                  )}
                  
                  <Link
                    href={`/dashboard/moves/${currentMove.id}`}
                    className="w-full inline-flex items-center justify-center px-4 py-2 border border-indigo-300 shadow-sm text-sm font-medium rounded-md text-indigo-700 bg-indigo-50 hover:bg-indigo-100"
                  >
                    ⚙️ Gestionar mudanza
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
