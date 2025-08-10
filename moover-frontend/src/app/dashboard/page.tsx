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
import MoveCompletedModal from '@/components/MoveCompletedModal';
import { calculatePriorityTasks, canGenerateTasks, PriorityUserTask } from '@/components/dashboard/utils';
import { useRouter } from 'next/navigation';

export default function DashboardPage() {
  const router = useRouter();
  const [currentMove, setCurrentMove] = useState<Move | null>(null);
  const [taskSummary, setTaskSummary] = useState<TaskSummary | null>(null);
  const [priorityTasks, setPriorityTasks] = useState<PriorityUserTask[]>([]);
  const [allUserTasks, setAllUserTasks] = useState<UserTask[]>([]);
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true);
  const [generatingTasks, setGeneratingTasks] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [showCompletedModal, setShowCompletedModal] = useState(false);

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        // Get current move (active or most recent)
        const moveResponse = await moveService.getCurrentMove();
        let moveToLoad = moveResponse.move;
        
        // If no current active move, get all moves and use the most recent one
        if (!moveToLoad) {
          console.log('No current active move, checking all moves...');
          const allMovesResponse = await moveService.getAllMoves();
          const moves = allMovesResponse.moves || [];
          
          if (moves.length > 0) {
            // Use the most recent move (completed or active)
            moveToLoad = moves.sort((a, b) => 
              new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
            )[0];
            console.log('Using most recent move:', moveToLoad);
          } else {
            // No moves at all, stay on dashboard but show empty state
            console.log('No moves found');
            setCurrentMove(null);
            setLoading(false);
            return;
          }
        }

        setCurrentMove(moveToLoad);

        // If there's a move (active or completed), get its data
        if (moveToLoad) {
          try {
            const [summaryResponse, userTasksResponse, roomsResponse] = await Promise.all([
              userTaskService.getTaskSummary(moveToLoad.id),
              userTaskService.getUserTasks(moveToLoad.id),
              roomService.getRooms(moveToLoad.id)
            ]);
            
            setTaskSummary(summaryResponse);
            setRooms(roomsResponse);
            setAllUserTasks(userTasksResponse);
            
            // Calculate priority tasks based on timeline
            const priorityTasks = calculatePriorityTasks(userTasksResponse, moveToLoad);
            setPriorityTasks(priorityTasks);
          } catch (summaryError) {
            console.error('Error loading move data:', summaryError);
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
      const response = await userTaskService.updateUserTask(currentMove.id, taskId, { completed });
      
      // Verificar si la mudanza se completó
      if (response.move_completed && !showCompletedModal) {
        setShowCompletedModal(true);
        // Actualizar el estado local de la mudanza
        setCurrentMove({ ...currentMove, status: 'completed' });
      }
      
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
    <main className="min-h-screen py-6 bg-gradient-to-br from-[#FAF6F3] to-[#F7F9FB]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8 gap-y-2">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-[#7C3AED] to-[#3B82F6] bg-clip-text text-transparent">Dashboard</h1>
              <p className="mt-2 text-lg text-gray-600">
                Estado general de tu mudanza
              </p>
            </div>
            
            {/* Navigation Menu */}
            <div className="flex gap-3">
              <button
                onClick={() => router.push('/history')}
                className="bg-white text-gray-700 py-2 px-4 rounded-lg border-2 border-gray-200 hover:border-gray-300 focus:ring-2 focus:ring-gray-200 font-medium transition-all duration-200 text-sm"
              >
                📊 Historial
              </button>
              <button
                onClick={() => router.push('/onboarding')}
                className="bg-gradient-to-r from-[#7C3AED] to-[#3B82F6] text-white py-2 px-4 rounded-lg hover:from-[#7C3AED]/90 hover:to-[#3B82F6]/90 transition-all duration-200 text-sm font-medium"
              >
                ✨ Nueva mudanza
              </button>
            </div>
          </div>
        </div>

        {/* Messages */}
        {error && (
          <div className="mb-8 bg-gradient-to-r from-[#F87171]/10 to-[#F87171]/5 border-2 border-[#F87171]/20 text-gray-800 px-6 py-4 rounded-lg shadow-md">
            <div className="flex items-center">
              <span className="text-[#F87171] text-lg mr-3">⚠️</span>
              <span>{error}</span>
            </div>
          </div>
        )}

        {successMessage && (
          <div className="mb-8 bg-gradient-to-r from-[#34D399]/10 to-[#34D399]/5 border-2 border-[#34D399]/20 text-gray-800 px-6 py-4 rounded-lg shadow-md">
            <div className="flex items-center">
              <span className="text-[#34D399] text-lg mr-3">✅</span>
              <span>{successMessage}</span>
            </div>
          </div>
        )}

        {/* Warning Messages */}
        <WarningMessages 
          missingOriginKeyDate={!!currentMove && !canGenerateTasks(currentMove)}
          onEditClick={handleEditClick}
        />

        {!currentMove ? (
          <EmptyDashboardState />
        ) : currentMove.status === 'completed' ? (
          <div className="text-center py-16">
            <div className="bg-gradient-to-br from-[#34D399]/10 to-[#10B981]/5 border border-[#34D399]/20 rounded-xl p-12 max-w-2xl mx-auto">
              <span className="text-6xl mb-6 block">🎉</span>
              <h2 className="text-3xl font-bold bg-gradient-to-r from-[#34D399] to-[#10B981] bg-clip-text text-transparent mb-4">
                ¡Mudanza completada!
              </h2>
              <p className="text-gray-600 mb-8 text-lg">
                Tu mudanza a <strong>{currentMove.destination_address}</strong> ha sido completada exitosamente.
              </p>
              <div className="grid md:grid-cols-2 gap-6 mb-8">
                <div className="bg-white rounded-lg p-6 shadow-md">
                  <h4 className="font-semibold text-gray-900 mb-2">📊 Estadísticas</h4>
                  {taskSummary && (
                    <p className="text-sm text-gray-600">
                      <strong>{taskSummary.summary.completed_tasks}</strong> de <strong>{taskSummary.summary.total_tasks}</strong> tareas completadas
                    </p>
                  )}
                </div>
                <div className="bg-white rounded-lg p-6 shadow-md">
                  <h4 className="font-semibold text-gray-900 mb-2">📅 Finalizada</h4>
                  <p className="text-sm text-gray-600">
                    {currentMove.updated_at ? new Date(currentMove.updated_at).toLocaleDateString('es-ES', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    }) : 'Fecha no disponible'}
                  </p>
                </div>
              </div>
              <div className="flex gap-4 justify-center">
                <button
                  onClick={() => router.push('/history')}
                  className="bg-gradient-to-r from-[#7C3AED]/10 to-[#3B82F6]/10 text-[#7C3AED] py-3 px-6 rounded-lg hover:from-[#7C3AED]/20 hover:to-[#3B82F6]/20 border border-[#7C3AED]/20 transition-all duration-200 font-medium"
                >
                  📊 Ver historial completo
                </button>
                <button
                  onClick={() => router.push('/onboarding')}
                  className="bg-gradient-to-r from-[#7C3AED] to-[#3B82F6] text-white py-3 px-6 rounded-lg hover:from-[#7C3AED]/90 hover:to-[#3B82F6]/90 transition-all duration-200 font-medium"
                >
                  ✨ Nueva mudanza
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="gap-y-8 space-y-8">
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
              <div className="lg:col-span-2 gap-y-8 space-y-8">
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
              <div className="gap-y-8 space-y-8">
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
        
        {/* Move Completed Modal */}
        <MoveCompletedModal
          isOpen={showCompletedModal}
          onClose={() => setShowCompletedModal(false)}
          moveTitle={currentMove ? `${currentMove.origin_address} → ${currentMove.destination_address}` : 'Tu mudanza'}
        />
      </div>
    </main>
  );
}
