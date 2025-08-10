'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { moveService, roomService, userTaskService } from '@/lib/services';
import { Move, Room, UserTask } from '@/types/api';
import DeleteMoveModal from '@/components/DeleteMoveModal';
import EditMoveModal from '@/components/EditMoveModal';
import MoveDetailsHeader from '@/components/move-details/MoveDetailsHeader';
import MoveInfoCard from '@/components/move-details/MoveInfoCard';
import RoomsCard from '@/components/move-details/RoomsCard';
import TasksPreviewCard from '@/components/move-details/TasksPreviewCard';
import WarningMessage from '@/components/move-details/WarningMessage';
import EmptyMoveState from '@/components/move-details/EmptyMoveState';

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
    return <EmptyMoveState />;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <MoveDetailsHeader
        move={move}
        onEditClick={() => setShowEditModal(true)}
        onDeleteClick={() => setShowDeleteModal(true)}
      />

      {/* Error Messages */}
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      {/* Success Messages */}
      {successMessage && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
          ✅ {successMessage}
        </div>
      )}

      {/* Warning Message */}
      <WarningMessage 
        canGenerateTasks={canGenerateTasks(move)}
        onEditClick={() => setShowEditModal(true)}
      />

      {/* Move Information */}
      <MoveInfoCard 
        move={move}
        completedTasks={completedTasks}
        totalTasks={totalTasks}
        progressPercentage={progressPercentage}
      />

      {/* Rooms */}
      <RoomsCard 
        move={move}
        rooms={rooms}
      />

      {/* Tasks Preview */}
      <TasksPreviewCard 
        move={move}
        userTasks={userTasks}
        totalTasks={totalTasks}
        onGenerateTasks={handleGenerateTasks}
        generatingTasks={generatingTasks}
        canGenerateTasks={canGenerateTasks(move)}
      />

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
