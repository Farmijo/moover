import Link from 'next/link';
import { Room, UserTask } from '@/types/api';

interface RoomsSidebarProps {
  rooms: Room[];
  allUserTasks: UserTask[];
  currentMoveId: number;
}

export default function RoomsSidebar({ rooms, allUserTasks, currentMoveId }: RoomsSidebarProps) {
  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-100">
      <div className="px-8 py-6 border-b border-gray-100">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold bg-gradient-to-r from-[#7C3AED] to-[#3B82F6] bg-clip-text text-transparent">🏠 Habitaciones</h3>
          <Link
            href={`/dashboard/moves/${currentMoveId}/rooms/new`}
            className="text-sm text-[#7C3AED] hover:text-[#3B82F6] font-medium transition-colors duration-200"
          >
            ✨ Añadir
          </Link>
        </div>
      </div>
      <div className="px-8 py-6">
        {rooms.length === 0 ? (
          <div className="text-center py-6">
            <p className="text-sm text-gray-500 mb-4">No hay habitaciones configuradas</p>
            <Link
              href={`/dashboard/moves/${currentMoveId}/rooms/new`}
              className="inline-flex items-center px-4 py-2 border-2 border-[#7C3AED]/30 shadow-sm text-sm leading-4 font-medium rounded-xl text-[#7C3AED] bg-white hover:border-[#7C3AED] hover:bg-[#7C3AED]/5 transition-all duration-200"
            >
              ✨ Añadir primera habitación
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {rooms.map((room) => {
              const roomTasks = allUserTasks.filter(task => task.room_id === room.id);
              return (
                <div key={room.id} className="flex items-center justify-between p-4 bg-gradient-to-r from-gray-50 to-gray-50/50 rounded-xl border border-gray-100 hover:border-[#7C3AED]/20 transition-all duration-200">
                  <div className="flex-1">
                    <h4 className="text-sm font-semibold text-gray-900">{room.name}</h4>
                    <p className="text-xs text-gray-500">{roomTasks.length} tareas</p>
                  </div>
                  <Link
                    href={`/dashboard/moves/${currentMoveId}/rooms/${room.id}`}
                    className="text-xs text-[#7C3AED] hover:text-[#3B82F6] font-medium transition-colors duration-200"
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
