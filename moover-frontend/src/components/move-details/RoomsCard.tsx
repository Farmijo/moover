import Link from 'next/link';
import { Move, Room } from '@/types/api';

interface RoomsCardProps {
  move: Move;
  rooms: Room[];
}

export default function RoomsCard({ move, rooms }: RoomsCardProps) {
  return (
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
  );
}
