import Link from 'next/link';
import { Room, UserTask } from '@/types/api';

interface RoomsSidebarProps {
  rooms: Room[];
  allUserTasks: UserTask[];
  currentMoveId: number;
}

export default function RoomsSidebar({ rooms, allUserTasks, currentMoveId }: RoomsSidebarProps) {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      <div className="px-6 py-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-medium text-gray-900">🏠 Habitaciones</h3>
          <Link
            href={`/dashboard/moves/${currentMoveId}/rooms/new`}
            className="text-sm text-indigo-600 hover:text-indigo-500"
          >
            + Añadir
          </Link>
        </div>
      </div>
      <div className="px-6 py-4">
        {rooms.length === 0 ? (
          <div className="text-center py-4">
            <p className="text-sm text-gray-500 mb-3">No hay habitaciones configuradas</p>
            <Link
              href={`/dashboard/moves/${currentMoveId}/rooms/new`}
              className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
            >
              + Añadir primera habitación
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {rooms.map((room) => {
              const roomTasks = allUserTasks.filter(task => task.room_id === room.id);
              return (
                <div key={room.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex-1">
                    <h4 className="text-sm font-medium text-gray-900">{room.name}</h4>
                    <p className="text-xs text-gray-500">{roomTasks.length} tareas</p>
                  </div>
                  <Link
                    href={`/dashboard/moves/${currentMoveId}/rooms/${room.id}`}
                    className="text-xs text-indigo-600 hover:text-indigo-500"
                  >
                    Ver →
                  </Link>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
