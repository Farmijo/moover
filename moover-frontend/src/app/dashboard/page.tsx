'use client';

import { useState, useEffect } from 'react';
import { moveService, userTaskService, roomService } from '@/lib/services';
import { Move, TaskSummary, UserTask, Room } from '@/types/api';
import EmptyDashboardState from '@/components/dashboard/EmptyDashboardState';
import CurrentMoveStatus from '@/components/dashboard/CurrentMoveStatus';
import KeyDates from '@/components/dashboard/KeyDates';
import PriorityTasks from '@/components/dashboard/PriorityTasks';
import StatsCards from '@/components/dashboard/StatsCards';
import RoomsSidebar from '@/components/dashboard/RoomsSidebar';
import QuickActions from '@/components/dashboard/QuickActions';
import WarningMessages from '@/components/dashboard/WarningMessages';
import { calculatePriorityTasks, canGenerateTasks, PriorityUserTask } from '@/components/dashboard/utils';

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

  const handleEditClick = () => {
    if (!currentMove) return;
    window.location.href = `/dashboard/moves/${currentMove.id}`;
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

      {/* Warning Messages */}
      <WarningMessages 
        missingOriginKeyDate={!!currentMove && !canGenerateTasks(currentMove)}
        onEditClick={handleEditClick}
      />

      {!currentMove ? (
        <EmptyDashboardState />
      ) : (
        <div className="space-y-8">
          {/* Current Move Status */}
          <CurrentMoveStatus
            currentMove={currentMove}
            taskSummary={taskSummary}
            generatingTasks={generatingTasks}
            canGenerateTasks={canGenerateTasks(currentMove)}
            onGenerateTasks={handleGenerateTasks}
          />

          {/* Key Dates */}
          <KeyDates currentMove={currentMove} />

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-8">
              {/* Priority Tasks */}
              <PriorityTasks
                priorityTasks={priorityTasks}
                currentMoveId={currentMove.id}
                onToggleTask={handleToggleTask}
              />

              {/* Stats Cards */}
              {taskSummary && <StatsCards taskSummary={taskSummary} />}
            </div>

            {/* Sidebar */}
            <div className="space-y-8">
              {/* Rooms Sidebar */}
              <RoomsSidebar
                currentMoveId={currentMove.id}
                rooms={rooms}
                allUserTasks={allUserTasks}
              />

              {/* Quick Actions */}
              <QuickActions
                currentMoveId={currentMove.id}
                taskSummary={taskSummary}
                onGenerateTasks={handleGenerateTasks}
                generatingTasks={generatingTasks}
                canGenerateTasks={canGenerateTasks(currentMove)}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
