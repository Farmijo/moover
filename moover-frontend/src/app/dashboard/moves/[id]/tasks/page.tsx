'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { userTaskService, moveService } from '@/lib/services';
import { UserTask, Move } from '@/types/api';
import { 
  TasksHeader, 
  TasksFilters, 
  TasksByCategory, 
  TasksByRoom, 
  GeneralTasksView, 
  EmptyTasksState 
} from '@/components/tasks';

export default function TasksPage() {
  const params = useParams();
  const moveId = params.id as string;

  const [move, setMove] = useState<Move | null>(null);
  const [userTasks, setUserTasks] = useState<UserTask[]>([]);
  const [loading, setLoading] = useState(true);
  const [generatingTasks, setGeneratingTasks] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [filter, setFilter] = useState<'all' | 'pending' | 'completed' | 'overdue'>('all');
  const [viewMode, setViewMode] = useState<'all' | 'by-room' | 'general'>('all');

  // Check if tasks can be generated (requires origin key delivery date)
  const canGenerateTasks = (move: Move | null): boolean => {
    if (!move) return false;
    return !!move.origin_key_delivery_date;
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [moveData, userTasksData] = await Promise.all([
          moveService.getMove(Number(moveId)),
          userTaskService.getUserTasks(Number(moveId))
        ]);
        
        setMove(moveData.move);
        setUserTasks(userTasksData);
      } catch (err) {
        setError('Error al cargar las tareas');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    if (moveId) {
      fetchData();
    }
  }, [moveId]);

  const handleToggleTask = async (taskId: number, completed: boolean) => {
    try {
      await userTaskService.updateUserTask(Number(moveId), taskId, { completed });
      
      setUserTasks(prev => 
        prev.map(task => 
          task.id === taskId 
            ? { 
                ...task, 
                completed, 
                completed_at: completed ? new Date().toISOString() : undefined 
              }
            : task
        )
      );
    } catch (err) {
      setError('Error al actualizar la tarea');
      console.error(err);
    }
  };

  const handleGenerateTasks = async () => {
    // Validar que la fecha de entrega de llaves del origen esté definida
    if (!move?.origin_key_delivery_date) {
      setError('Para generar tareas es necesario definir la fecha de entrega de llaves del piso de origen.');
      return;
    }
    
    try {
      setError('');
      setSuccessMessage('');
      setGeneratingTasks(true);
      console.log('Generating tasks for move ID:', moveId);
      const result = await moveService.generateTasks(Number(moveId));
      console.log('Generate tasks result:', result);
      // Recargar las tareas después de generar
      const updatedUserTasks = await userTaskService.getUserTasks(Number(moveId));
      setUserTasks(updatedUserTasks);
      setSuccessMessage(`Se generaron ${result.tasks_count} tareas correctamente`);
      
      // Ocultar el mensaje de éxito después de 5 segundos
      setTimeout(() => {
        setSuccessMessage('');
      }, 5000);
    } catch (err) {
      console.error('Error generating tasks:', err);
      const error = err as { response?: { status?: number; data?: unknown } };
      if (error.response?.status === 404) {
        setError(`Error 404: La ruta /api/moves/${moveId}/generate_tasks no fue encontrada. Verifica que el servidor esté ejecutándose correctamente.`);
      } else {
        setError('Error al generar tareas');
      }
    } finally {
      setGeneratingTasks(false);
    }
  };

  // Helper functions for filtering and grouping
  const getFilteredTasks = () => {
    const now = new Date();
    
    return userTasks.filter(task => {
      switch (filter) {
        case 'completed':
          return task.completed;
        case 'pending':
          return !task.completed;
        case 'overdue':
          return !task.completed && task.due_date && new Date(task.due_date) < now;
        default:
          return true;
      }
    });
  };

  const getTasksByCategory = () => {
    const filtered = getFilteredTasks();
    const categories: Record<string, UserTask[]> = {};
    
    filtered.forEach(task => {
      const category = task.task?.category_display || 'General';
      if (!categories[category]) {
        categories[category] = [];
      }
      categories[category].push(task);
    });
    
    return categories;
  };

  const getTasksByRoom = () => {
    const filtered = getFilteredTasks();
    const rooms: Record<string, UserTask[]> = {};
    
    filtered.forEach(task => {
      const roomKey = task.room?.name;
      if (!roomKey) return;
      if (!rooms[roomKey]) {
        rooms[roomKey] = [];
      }
      rooms[roomKey].push(task);
    });
    
    return rooms;
  };

  const getGeneralTasks = () => {
    return getFilteredTasks().filter(task => !task.room);
  };

  const getRoomTasks = () => {
    return getFilteredTasks().filter(task => task.room);
  };

  const getUniqueRooms = () => {
    const roomsSet = new Set<string>();
    userTasks.forEach(task => {
      if (task.room) {
        roomsSet.add(task.room.name);
      }
    });
    return Array.from(roomsSet);
  };

  // Calculated values
  const completedTasks = userTasks.filter(task => task.completed).length;
  const totalTasks = userTasks.length;
  const progressPercentage = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
  
  const tasksByCategory = getTasksByCategory();
  const tasksByRoom = getTasksByRoom();
  const generalTasks = getGeneralTasks();
  const roomTasks = getRoomTasks();

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <TasksHeader
        move={move}
        moveId={moveId}
        totalTasks={totalTasks}
        completedTasks={completedTasks}
        progressPercentage={progressPercentage}
        onGenerateTasks={handleGenerateTasks}
        generatingTasks={generatingTasks}
        canGenerateTasks={canGenerateTasks(move)}
      />

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      {successMessage && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
          ✅ {successMessage}
        </div>
      )}

      {/* Warning when cannot generate tasks */}
      {move && !canGenerateTasks(move) && (
        <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded">
          ⚠️ Para generar y calcular las tareas correctamente, es necesario definir la fecha de entrega de llaves del piso de origen.{' '}
          <Link
            href={`/dashboard/moves/${moveId}`}
            className="font-medium underline hover:no-underline"
          >
            Configurar fechas →
          </Link>
        </div>
      )}

      {userTasks.length === 0 ? (
        <EmptyTasksState
          onGenerateTasks={handleGenerateTasks}
          generatingTasks={generatingTasks}
          canGenerateTasks={canGenerateTasks(move)}
        />
      ) : (
        <>
          <TasksFilters
            viewMode={viewMode}
            filter={filter}
            onViewModeChange={setViewMode}
            onFilterChange={setFilter}
            userTasks={userTasks}
            getUniqueRooms={getUniqueRooms}
            generalTasks={generalTasks}
            roomTasks={roomTasks}
          />

          {/* Lista de tareas según el modo de vista */}
          <div className="space-y-6">
            {viewMode === 'all' && (
              <TasksByCategory
                tasksByCategory={tasksByCategory}
                onToggleTask={handleToggleTask}
                moveOutDate={move?.origin_move_out_date}
                keyDeliveryDate={move?.destination_key_delivery_date}
              />
            )}

            {viewMode === 'by-room' && (
              <TasksByRoom
                tasksByRoom={tasksByRoom}
                onToggleTask={handleToggleTask}
                moveOutDate={move?.origin_move_out_date}
                keyDeliveryDate={move?.destination_key_delivery_date}
              />
            )}

            {viewMode === 'general' && (
              <GeneralTasksView
                generalTasks={generalTasks}
                onToggleTask={handleToggleTask}
                moveOutDate={move?.origin_move_out_date}
                keyDeliveryDate={move?.destination_key_delivery_date}
              />
            )}
          </div>
        </>
      )}
    </div>
  );
}
