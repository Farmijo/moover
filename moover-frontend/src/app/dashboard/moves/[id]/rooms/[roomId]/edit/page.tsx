'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { roomService } from '@/lib/services';
import { Room, RoomType } from '@/types/api';

export default function EditRoomPage() {
  const params = useParams();
  const router = useRouter();
  const moveId = params.id as string;
  const roomId = params.roomId as string;

  const [room, setRoom] = useState<Room | null>(null);
  const [roomTypes, setRoomTypes] = useState<RoomType[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(true);
  const [error, setError] = useState('');
  
  const [formData, setFormData] = useState({
    name: '',
    room_type: ''
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoadingData(true);
        const [roomData, roomTypesData] = await Promise.all([
          roomService.getRoom(Number(moveId), Number(roomId)),
          roomService.getRoomTypes(Number(moveId))
        ]);
        
        setRoom(roomData);
        setRoomTypes(roomTypesData.room_types);
        setFormData({
          name: roomData.name,
          room_type: roomData.room_type
        });
      } catch (err) {
        setError('Error al cargar los datos de la habitación');
        console.error(err);
      } finally {
        setLoadingData(false);
      }
    };

    if (moveId && roomId) {
      fetchData();
    }
  }, [moveId, roomId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await roomService.updateRoom(Number(moveId), Number(roomId), formData);
      router.push(`/dashboard/moves/${moveId}/rooms/${roomId}`);
    } catch (err: unknown) {
      const error = err as { response?: { data?: { errors?: string[] } } };
      const errorMessage = error.response?.data?.errors?.[0] || 'Error al actualizar la habitación';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  if (loadingData) {
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
          <button
            onClick={() => router.back()}
            className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
          >
            Volver
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="md:flex md:items-center md:justify-between mb-6">
        <div className="flex-1 min-w-0">
          <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">
            Editar Habitación
          </h2>
          <p className="mt-1 text-sm text-gray-500">
            Modifica los datos de &ldquo;{room.name}&rdquo;
          </p>
        </div>
      </div>

      <div className="bg-white shadow-sm rounded-lg">
        <form onSubmit={handleSubmit} className="space-y-6 p-6">
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
              {error}
            </div>
          )}

          {/* Nombre de la habitación */}
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">
              Nombre de la habitación *
            </label>
            <input
              type="text"
              name="name"
              id="name"
              required
              value={formData.name}
              onChange={handleChange}
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              placeholder="ej. Dormitorio principal, Cocina, Salón..."
            />
            <p className="mt-1 text-sm text-gray-500">
              Usa un nombre descriptivo para identificar fácilmente la habitación
            </p>
          </div>

          {/* Tipo de habitación */}
          <div>
            <label htmlFor="room_type" className="block text-sm font-medium text-gray-700">
              Tipo de habitación *
            </label>
            <select
              name="room_type"
              id="room_type"
              required
              value={formData.room_type}
              onChange={handleChange}
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            >
              <option value="">Selecciona un tipo</option>
              {roomTypes.map((type) => (
                <option key={type.value} value={type.value}>
                  {type.display}
                </option>
              ))}
            </select>
            <p className="mt-1 text-sm text-gray-500">
              El tipo de habitación ayuda a generar tareas específicas
            </p>
          </div>

          {/* Información adicional */}
          <div className="bg-blue-50 border-l-4 border-blue-400 p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-blue-400" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                  <path fillRule="evenodd" d="M8.485 2.495c.673-1.167 2.357-1.167 3.03 0l6.28 10.875c.673 1.167-.17 2.625-1.516 2.625H3.72c-1.347 0-2.189-1.458-1.515-2.625L8.485 2.495zM10 5a.75.75 0 01.75.75v3.5a.75.75 0 01-1.5 0v-3.5A.75.75 0 0110 5zm0 9a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-blue-700">
                  <strong>Información:</strong> Al cambiar el tipo de habitación, las tareas futuras generadas se adaptarán al nuevo tipo. 
                  Las tareas ya existentes no se verán afectadas.
                </p>
              </div>
            </div>
          </div>

          {/* Datos de la habitación actual */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h4 className="text-sm font-medium text-gray-700 mb-2">Información actual</h4>
            <dl className="grid grid-cols-1 gap-2 sm:grid-cols-2 text-sm">
              <div>
                <dt className="text-gray-500">ID:</dt>
                <dd className="font-medium text-gray-900">#{room.id}</dd>
              </div>
              <div>
                <dt className="text-gray-500">Creada:</dt>
                <dd className="font-medium text-gray-900">
                  {new Date(room.created_at).toLocaleDateString('es-ES')}
                </dd>
              </div>
              <div>
                <dt className="text-gray-500">Última actualización:</dt>
                <dd className="font-medium text-gray-900">
                  {new Date(room.updated_at).toLocaleDateString('es-ES')}
                </dd>
              </div>
            </dl>
          </div>

          {/* Botones */}
          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={() => router.back()}
              className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Guardando...' : 'Guardar cambios'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
