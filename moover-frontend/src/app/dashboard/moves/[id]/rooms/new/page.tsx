'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { roomService } from '@/lib/services';
import { RoomType } from '@/types/api';

export default function NewRoomPage() {
  const params = useParams();
  const router = useRouter();
  const moveId = params.id as string;

  const [loading, setLoading] = useState(false);
  const [loadingTypes, setLoadingTypes] = useState(true);
  const [error, setError] = useState('');
  const [roomTypes, setRoomTypes] = useState<RoomType[]>([]);
  
  const [formData, setFormData] = useState({
    name: '',
    room_type: ''
  });

  useEffect(() => {
    const fetchRoomTypes = async () => {
      try {
        setLoadingTypes(true);
        const data = await roomService.getRoomTypes(Number(moveId));
        setRoomTypes(data.room_types);
      } catch (err) {
        setError('Error al cargar los tipos de habitación');
        console.error(err);
      } finally {
        setLoadingTypes(false);
      }
    };

    if (moveId) {
      fetchRoomTypes();
    }
  }, [moveId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await roomService.createRoom(Number(moveId), formData);
      router.push(`/dashboard/moves/${moveId}/rooms`);
    } catch (err: unknown) {
      const error = err as { response?: { data?: { errors?: string[] } } };
      const errorMessage = error.response?.data?.errors?.[0] || 'Error al crear la habitación';
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

  if (loadingTypes) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="md:flex md:items-center md:justify-between mb-6">
        <div className="flex-1 min-w-0">
          <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">
            Nueva Habitación
          </h2>
          <p className="mt-1 text-sm text-gray-500">
            Añade una habitación para organizar mejor tu mudanza
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
              {loading ? 'Creando...' : 'Crear habitación'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
