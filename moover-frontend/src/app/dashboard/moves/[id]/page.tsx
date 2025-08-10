'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { moveService, roomService, userTaskService } from '@/lib/services';
import { Move, Room, UserTask } from '@/types/api';
import DeleteMoveModal from '@/components/DeleteMoveModal';
import EditMoveModal from '@/components/EditMoveModal';

export default function MoveDetailPage() {
  const params = useParams();
  const router = useRouter();
  const moveId = params.id as string;

  const [move, setMove] = useState<Move | null>(null);
  const [rooms, setRooms] = useState<Room[]>([]);
  const [userTasks, setUserTasks] = useState<UserTask[]>([]);
  const [loading, setLoading] = useState(true);
  const [generatingTasks, setGeneratingTasks] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deletingMove, setDeletingMove] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [updatingMove, setUpdatingMove] = useState(false);

  // Check if tasks can be generated (requires origin key delivery date)
  const canGenerateTasks = (move: Move | null): boolean => {
    if (!move) return false;
    return !!move.origin_key_delivery_date;
  };

  useEffect(() => {
    const fetchMoveDetails = async () => {
      try {
        setLoading(true);
        const [moveData, roomsData, userTasksData] = await Promise.all([
          moveService.getMove(Number(moveId)),
          roomService.getRooms(Number(moveId)),
          userTaskService.getUserTasks(Number(moveId))
        ]);
        
        setMove(moveData.move);
        setRooms(roomsData);
        setUserTasks(userTasksData);
      } catch (err) {
        setError('Error al cargar los detalles de la mudanza');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    if (moveId) {
      fetchMoveDetails();
    }
  }, [moveId]);

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

  const handleDeleteMove = async () => {
    if (!move) return;
    
    try {
      setDeletingMove(true);
      setError('');
      
      await moveService.deleteMove(move.id);
      
      setSuccessMessage('Mudanza eliminada correctamente');
      setShowDeleteModal(false);
      
      // Redirigir al dashboard después de un breve delay
      setTimeout(() => {
        router.push('/dashboard');
      }, 1500);
      
    } catch (err) {
      console.error('Error deleting move:', err);
      const error = err as { response?: { status?: number; data?: { error?: string } } };
      
      // Manejar errores específicos del backend
      if (error.response?.status === 422) {
        setError(error.response.data?.error || 'No se puede eliminar esta mudanza');
      } else if (error.response?.status === 404) {
        setError('Mudanza no encontrada');
      } else {
        setError('Error al eliminar la mudanza');
      }
      
      setShowDeleteModal(false);
    } finally {
      setDeletingMove(false);
    }
  };

  const handleUpdateMove = async (moveData: Partial<Move>) => {
    if (!move) return;
    
    try {
      setUpdatingMove(true);
      setError('');
      
      const response = await moveService.updateMove(move.id, moveData);
      
      // Actualizar el estado local con los nuevos datos
      setMove(response.move);
      setSuccessMessage('Mudanza actualizada correctamente');
      setShowEditModal(false);
      
      // Ocultar el mensaje de éxito después de 3 segundos
      setTimeout(() => {
        setSuccessMessage('');
      }, 3000);
      
    } catch (err) {
      console.error('Error updating move:', err);
      const error = err as { response?: { status?: number; data?: { errors?: string[] } } };
      
      // Manejar errores específicos del backend
      if (error.response?.status === 422) {
        const errors = error.response.data?.errors || ['Error al actualizar la mudanza'];
        setError(errors.join(', '));
      } else if (error.response?.status === 404) {
        setError('Mudanza no encontrada');
      } else {
        setError('Error al actualizar la mudanza');
      }
      
      setShowEditModal(false);
    } finally {
      setUpdatingMove(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'planning':
        return 'bg-yellow-100 text-yellow-800';
      case 'in_progress':
        return 'bg-blue-100 text-blue-800';
      case 'completed':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'planning':
        return 'Planificando';
      case 'in_progress':
        return 'En progreso';
      case 'completed':
        return 'Completada';
      default:
        return status;
    }
  };

  const getMoveTypeText = (moveType: string) => {
    switch (moveType) {
      case 'apartment':
        return 'Piso/Apartamento';
      case 'house':
        return 'Casa';
      case 'office':
        return 'Oficina';
      case 'storage':
        return 'Trastero';
      case 'other':
        return 'Otro';
      default:
        return moveType;
    }
  };

  const completedTasks = userTasks.filter(task => task.completed).length;
  const totalTasks = userTasks.length;
  const progressPercentage = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  if (!move) {
    return (
      <div className="text-center">
        <h3 className="mt-2 text-sm font-medium text-gray-900">Mudanza no encontrada</h3>
        <p className="mt-1 text-sm text-gray-500">
          No se pudo cargar la información de esta mudanza.
        </p>
        <div className="mt-6">
          <Link
            href="/dashboard"
            className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
          >
            Volver al dashboard
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
          <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">
            Mudanza #{move.id}
          </h2>
          <div className="mt-1 flex flex-col sm:flex-row sm:flex-wrap sm:space-x-6">
            <div className="mt-2 flex items-center text-sm text-gray-500">
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(move.status)}`}>
                {getStatusText(move.status)}
              </span>
            </div>
          </div>
        </div>
        <div className="mt-4 flex md:mt-0 md:ml-4 space-x-3">
          <Link
            href={`/dashboard/moves/${move.id}/rooms`}
            className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
          >
            Gestionar habitaciones
          </Link>
          <button
            onClick={() => setShowEditModal(true)}
            className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
            Editar
          </button>
          <button
            onClick={handleGenerateTasks}
            disabled={generatingTasks || !canGenerateTasks(move)}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
            title={!canGenerateTasks(move) ? 'Se requiere definir la fecha de entrega de llaves del origen' : ''}
          >
            {generatingTasks ? (
              <>
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="m4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Generando tareas...
              </>
            ) : (
              'Generar tareas'
            )}
          </button>
          <button
            onClick={() => setShowDeleteModal(true)}
            className="inline-flex items-center px-4 py-2 border border-red-300 rounded-md shadow-sm text-sm font-medium text-red-700 bg-white hover:bg-red-50"
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
            Eliminar mudanza
          </button>
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

      {/* Warning when cannot generate tasks */}
      {move && !canGenerateTasks(move) && (
        <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded">
          ⚠️ Para generar y calcular las tareas correctamente, es necesario definir la fecha de entrega de llaves del piso de origen.{' '}
          <button
            onClick={() => setShowEditModal(true)}
            className="font-medium underline hover:no-underline"
          >
            Configurar fechas →
          </button>
        </div>
      )}

      {/* Información de la mudanza */}
      <div className="bg-white shadow-sm rounded-lg">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg leading-6 font-medium text-gray-900">
            Información de la mudanza
          </h3>
        </div>
        <div className="px-6 py-4">
          <dl className="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2">
            <div>
              <dt className="text-sm font-medium text-gray-500">Dirección de origen</dt>
              <dd className="mt-1 text-sm text-gray-900">{move.origin_address}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">Dirección de destino</dt>
              <dd className="mt-1 text-sm text-gray-900">{move.destination_address}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">Tipo de mudanza</dt>
              <dd className="mt-1 text-sm text-gray-900">{getMoveTypeText(move.move_type)}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">Progreso</dt>
              <dd className="mt-1 text-sm text-gray-900">
                <div className="flex items-center">
                  <div className="w-full bg-gray-200 rounded-full h-2.5 mr-2">
                    <div 
                      className="bg-indigo-600 h-2.5 rounded-full" 
                      style={{ width: `${progressPercentage}%` }}
                    ></div>
                  </div>
                  <span className="text-sm font-medium text-gray-900">{progressPercentage}%</span>
                </div>
                <p className="mt-1 text-xs text-gray-500">
                  {completedTasks} de {totalTasks} tareas completadas
                </p>
              </dd>
            </div>
            {move.destination_key_delivery_date && (
              <div>
                <dt className="text-sm font-medium text-gray-500">Entrega llaves destino</dt>
                <dd className="mt-1 text-sm text-gray-900">
                  {new Date(move.destination_key_delivery_date).toLocaleDateString('es-ES')}
                </dd>
              </div>
            )}
            {move.origin_move_out_date && (
              <div>
                <dt className="text-sm font-medium text-gray-500">Fecha de salida</dt>
                <dd className="mt-1 text-sm text-gray-900">
                  {new Date(move.origin_move_out_date).toLocaleDateString('es-ES')}
                </dd>
              </div>
            )}
          </dl>
        </div>
      </div>

      {/* Habitaciones */}
      <div className="bg-white shadow-sm rounded-lg">
        <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
          <h3 className="text-lg leading-6 font-medium text-gray-900">
            Habitaciones ({rooms.length})
          </h3>
          <Link
            href={`/dashboard/moves/${move.id}/rooms/new`}
            className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-200"
          >
            Añadir habitación
          </Link>
        </div>
        <div className="px-6 py-4">
          {rooms.length === 0 ? (
            <p className="text-sm text-gray-500">No hay habitaciones creadas aún.</p>
          ) : (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {rooms.map((room) => (
                <div key={room.id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50">
                  <h4 className="text-sm font-medium text-gray-900">{room.name}</h4>
                  <p className="mt-1 text-sm text-gray-500">{room.room_type}</p>
                  <div className="mt-3 flex justify-between items-center">
                    <span className="text-xs text-gray-400">#{room.id}</span>
                    <Link
                      href={`/dashboard/moves/${move.id}/rooms/${room.id}`}
                      className="text-xs text-indigo-600 hover:text-indigo-900"
                    >
                      Ver detalles
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Tareas */}
      <div className="bg-white shadow-sm rounded-lg">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg leading-6 font-medium text-gray-900">
            Tareas ({totalTasks})
          </h3>
        </div>
        <div className="px-6 py-4">
          {userTasks.length === 0 ? (
            <div className="text-center">
              <p className="text-sm text-gray-500 mb-4">
                No hay tareas generadas aún. Genera tareas automáticamente basadas en tu mudanza.
              </p>
              <button
                onClick={handleGenerateTasks}
                disabled={generatingTasks || !canGenerateTasks(move)}
                className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
                title={!canGenerateTasks(move) ? 'Se requiere definir la fecha de entrega de llaves del origen' : ''}
              >
                {generatingTasks ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="m4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Generando...
                  </>
                ) : (
                  'Generar tareas'
                )}
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {userTasks.slice(0, 5).map((userTask) => (
                <div key={userTask.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      checked={userTask.completed}
                      onChange={() => {
                        // Aquí implementarías el toggle de completar tarea
                        console.log('Toggle task:', userTask.id);
                      }}
                      className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                    />
                    <div className="ml-3">
                      <p className={`text-sm ${userTask.completed ? 'line-through text-gray-500' : 'text-gray-900'}`}>
                        {userTask.name}
                      </p>
                      {userTask.task?.description && (
                        <p className="text-xs text-gray-500">{userTask.task.description}</p>
                      )}
                    </div>
                  </div>
                  <div className="text-xs text-gray-400">
                    {userTask.task?.category || 'General'}
                  </div>
                </div>
              ))}
              
              {userTasks.length > 5 && (
                <div className="text-center pt-4">
                  <Link
                    href={`/dashboard/moves/${move.id}/tasks`}
                    className="text-sm text-indigo-600 hover:text-indigo-900"
                  >
                    Ver todas las tareas ({userTasks.length})
                  </Link>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Delete Move Modal */}
      <DeleteMoveModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleDeleteMove}
        move={move}
        isDeleting={deletingMove}
      />

      {/* Edit Move Modal */}
      <EditMoveModal
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        onSave={handleUpdateMove}
        move={move}
        isUpdating={updatingMove}
      />
    </div>
  );
}
