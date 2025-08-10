'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { roomService, userTaskService } from '@/lib/services';
import { Room, UserTask } from '@/types/api';

export default function RoomDetailPage() {
  const params = useParams();
  const moveId = params.id as string;
  const roomId = params.roomId as string;

  const [room, setRoom] = useState<Room | null>(null);
  const [roomTasks, setRoomTasks] = useState<UserTask[]>([]);
  const [loading, setLoading] = useState(true);
  const [generatingTasks, setGeneratingTasks] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    const fetchRoomDetails = async () => {
      try {
        setLoading(true);
        const [roomData, userTasksData] = await Promise.all([
          roomService.getRoom(Number(moveId), Number(roomId)),
          userTaskService.getUserTasks(Number(moveId))
        ]);
        
        setRoom(roomData);
        // Filtrar tareas específicas de esta habitación
        const tasksForRoom = userTasksData.filter(task => task.room_id === Number(roomId));
        setRoomTasks(tasksForRoom);
      } catch (err) {
        setError('Error al cargar los detalles de la habitación');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    if (moveId && roomId) {
      fetchRoomDetails();
    }
  }, [moveId, roomId]);

  const handleGenerateRoomTasks = async () => {
    if (!room) return;
    
    try {
      setError('');
      setSuccessMessage('');
      setGeneratingTasks(true);
      
      const result = await roomService.generateRoomTasks(Number(moveId), Number(roomId));
      
      // Recargar las tareas de la habitación
      const updatedUserTasks = await userTaskService.getUserTasks(Number(moveId));
      const tasksForRoom = updatedUserTasks.filter(task => task.room_id === Number(roomId));
      setRoomTasks(tasksForRoom);
      
      setSuccessMessage(`Se generaron ${result.tasks_count} tareas específicas para ${room.name}`);
      
      // Ocultar el mensaje de éxito después de 5 segundos
      setTimeout(() => {
        setSuccessMessage('');
      }, 5000);
    } catch (err) {
      console.error('Error generating room tasks:', err);
      setError('Error al generar tareas para esta habitación');
    } finally {
      setGeneratingTasks(false);
    }
  };

  const handleToggleTask = async (taskId: number, completed: boolean) => {
    try {
      await userTaskService.updateUserTask(Number(moveId), taskId, { completed });
      
      setRoomTasks(prev => 
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

  const getRoomTypeDisplay = (roomType: string) => {
    const types: Record<string, string> = {
      'living_room': 'Salón',
      'bedroom': 'Dormitorio',
      'kitchen': 'Cocina',
      'bathroom': 'Baño',
      'dining_room': 'Comedor',
      'office': 'Oficina',
      'garage': 'Garaje',
      'basement': 'Sótano',
      'attic': 'Ático',
      'balcony': 'Balcón',
      'storage': 'Trastero',
      'other': 'Otro'
    };
    return types[roomType] || roomType;
  };

  const completedTasks = roomTasks.filter(task => task.completed).length;
  const totalTasks = roomTasks.length;
  const progressPercentage = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  if (!room) {
    return (
      <div className="text-center">
        <h3 className="mt-2 text-sm font-medium text-gray-900">Habitación no encontrada</h3>
        <p className="mt-1 text-sm text-gray-500">
          No se pudo cargar la información de esta habitación.
        </p>
        <div className="mt-6">
          <Link
            href={`/dashboard/moves/${moveId}/rooms`}
            className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
          >
            Volver a habitaciones
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="md:flex md:items-center md:justify-between">
        <div className="flex-1 min-w-0">
          <div className="flex items-center">
            <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">
              {room.name}
            </h2>
            <span className="ml-3 inline-flex items-center px-3 py-0.5 rounded-full text-sm font-medium bg-indigo-100 text-indigo-800">
              {getRoomTypeDisplay(room.room_type)}
            </span>
          </div>
          {totalTasks > 0 && (
            <div className="mt-2 flex items-center">
              <div className="w-64 bg-gray-200 rounded-full h-2 mr-3">
                <div 
                  className="bg-indigo-600 h-2 rounded-full" 
                  style={{ width: `${progressPercentage}%` }}
                ></div>
              </div>
              <span className="text-sm text-gray-600">
                {completedTasks}/{totalTasks} tareas completadas ({progressPercentage}%)
              </span>
            </div>
          )}
        </div>
        <div className="mt-4 flex md:mt-0 md:ml-4 space-x-3">
          <Link
            href={`/dashboard/moves/${moveId}/rooms`}
            className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
          >
            ← Volver a habitaciones
          </Link>
          <Link
            href={`/dashboard/moves/${moveId}/rooms/${roomId}/edit`}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
          >
            Editar habitación
          </Link>
        </div>
      </div>

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

      {/* Información de la habitación */}
      <div className="bg-white shadow-sm rounded-lg">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg leading-6 font-medium text-gray-900">
            Información de la habitación
          </h3>
        </div>
        <div className="px-6 py-4">
          <dl className="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2">
            <div>
              <dt className="text-sm font-medium text-gray-500">Nombre</dt>
              <dd className="mt-1 text-sm text-gray-900">{room.name}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">Tipo de habitación</dt>
              <dd className="mt-1 text-sm text-gray-900">{getRoomTypeDisplay(room.room_type)}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">ID de habitación</dt>
              <dd className="mt-1 text-sm text-gray-900">#{room.id}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">Fecha de creación</dt>
              <dd className="mt-1 text-sm text-gray-900">
                {new Date(room.created_at).toLocaleDateString('es-ES')}
              </dd>
            </div>
          </dl>
        </div>
      </div>

      {/* Tareas de la habitación */}
      <div className="bg-white shadow-sm rounded-lg">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg leading-6 font-medium text-gray-900">
            Tareas específicas de esta habitación ({totalTasks})
          </h3>
        </div>
        <div className="px-6 py-4">
          {roomTasks.length === 0 ? (
            <div className="text-center py-8">
              <div className="mx-auto h-12 w-12 text-gray-400">
                <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                </svg>
              </div>
              <h4 className="mt-2 text-sm font-medium text-gray-900">No hay tareas específicas</h4>
              <p className="mt-1 text-sm text-gray-500">
                Esta habitación no tiene tareas específicas asignadas aún.
              </p>
              <div className="mt-4">
                <button
                  onClick={handleGenerateRoomTasks}
                  disabled={generatingTasks}
                  className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {generatingTasks ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-indigo-700" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="m4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Generando tareas...
                    </>
                  ) : (
                    `Generar tareas para ${room.name}`
                  )}
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              {roomTasks.map((userTask) => (
                <div key={userTask.id} className="flex items-start justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-start">
                    <div className="flex items-center h-5">
                      <input
                        type="checkbox"
                        checked={userTask.completed}
                        onChange={(e) => handleToggleTask(userTask.id, e.target.checked)}
                        className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                      />
                    </div>
                    <div className="ml-3 text-sm">
                      <p className={`font-medium ${
                        userTask.completed ? 'line-through text-gray-500' : 'text-gray-900'
                      }`}>
                        {userTask.name}
                      </p>
                      {userTask.task?.description && (
                        <p className="text-gray-500 mt-1">
                          {userTask.task.description}
                        </p>
                      )}
                      <div className="flex items-center mt-2 space-x-4 text-xs text-gray-400">
                        {userTask.task?.category && (
                          <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800">
                            {userTask.task.category}
                          </span>
                        )}
                        {userTask.due_date && (
                          <span className={`${
                            !userTask.completed && new Date(userTask.due_date) < new Date()
                              ? 'text-red-500 font-medium'
                              : ''
                          }`}>
                            📅 {new Date(userTask.due_date).toLocaleDateString('es-ES')}
                          </span>
                        )}
                        {userTask.completed_at && (
                          <span className="text-green-600">
                            ✅ Completada el {new Date(userTask.completed_at).toLocaleDateString('es-ES')}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="text-xs text-gray-400">
                    #{userTask.id}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Estadísticas rápidas */}
      {totalTasks > 0 && (
        <div className="bg-white shadow-sm rounded-lg">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg leading-6 font-medium text-gray-900">
              Estadísticas de la habitación
            </h3>
          </div>
          <div className="px-6 py-4">
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-indigo-600">{totalTasks}</div>
                <div className="text-xs text-gray-500">Total tareas</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">{completedTasks}</div>
                <div className="text-xs text-gray-500">Completadas</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-orange-600">{totalTasks - completedTasks}</div>
                <div className="text-xs text-gray-500">Pendientes</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">{progressPercentage}%</div>
                <div className="text-xs text-gray-500">Progreso</div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
