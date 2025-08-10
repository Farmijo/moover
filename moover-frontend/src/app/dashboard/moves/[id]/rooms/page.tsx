'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { roomService } from '@/lib/services';
import { Room } from '@/types/api';

export default function RoomsPage() {
  const params = useParams();
  const moveId = params.id as string;

  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        setLoading(true);
        const roomsData = await roomService.getRooms(Number(moveId));
        setRooms(roomsData);
      } catch (err) {
        setError('Error al cargar las habitaciones');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    if (moveId) {
      fetchRooms();
    }
  }, [moveId]);

  const handleDeleteRoom = async (roomId: number) => {
    if (!confirm('¿Estás seguro de que quieres eliminar esta habitación?')) {
      return;
    }

    try {
      await roomService.deleteRoom(Number(moveId), roomId);
      setRooms(rooms.filter(room => room.id !== roomId));
    } catch (err) {
      setError('Error al eliminar la habitación');
      console.error(err);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="md:flex md:items-center md:justify-between">
        <div className="flex-1 min-w-0">
          <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">
            Habitaciones
          </h2>
          <p className="mt-1 text-sm text-gray-500">
            Gestiona las habitaciones de tu mudanza
          </p>
        </div>
        <div className="mt-4 flex md:mt-0 md:ml-4 space-x-3">

          <Link
            href={`/dashboard/moves/${moveId}/rooms/new`}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
          >
            Añadir habitación
          </Link>
        </div>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      {/* Lista de habitaciones */}
      <div className="bg-white shadow-sm rounded-lg">
        {rooms.length === 0 ? (
          <div className="text-center py-12">
            <div className="mx-auto h-12 w-12 text-gray-400">
              <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-4m-5 0H3m2 0h3M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            </div>
            <h3 className="mt-2 text-sm font-medium text-gray-900">No hay habitaciones</h3>
            <p className="mt-1 text-sm text-gray-500">
              Añade habitaciones para organizar mejor tu mudanza.
            </p>
            <div className="mt-6">
              <Link
                href={`/dashboard/moves/${moveId}/rooms/new`}
                className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
              >
                Añadir primera habitación
              </Link>
            </div>
          </div>
        ) : (
          <div className="overflow-hidden">
            <div className="divide-y divide-gray-200">
              {rooms.map((room) => (
                <div key={room.id} className="px-6 py-4 hover:bg-gray-50">
                  <div className="flex items-center justify-between">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center">
                        <div>
                          <h3 className="text-sm font-medium text-gray-900 truncate">
                            {room.name}
                          </h3>
                          <p className="text-sm text-gray-500">
                            {room.room_type}
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Link
                        href={`/dashboard/moves/${moveId}/rooms/${room.id}`}
                        className="inline-flex items-center px-3 py-1 border border-transparent text-xs font-medium rounded text-indigo-700 bg-indigo-100 hover:bg-indigo-200"
                      >
                        Ver detalles
                      </Link>
                      <Link
                        href={`/dashboard/moves/${moveId}/rooms/${room.id}/edit`}
                        className="inline-flex items-center px-3 py-1 border border-gray-300 text-xs font-medium rounded text-gray-700 bg-white hover:bg-gray-50"
                      >
                        Editar
                      </Link>
                      <button
                        onClick={() => handleDeleteRoom(room.id)}
                        className="inline-flex items-center px-3 py-1 border border-transparent text-xs font-medium rounded text-red-700 bg-red-100 hover:bg-red-200"
                      >
                        Eliminar
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
