import { UserTask } from '@/types/api';
import TaskItem from './TaskItem';

interface TasksByRoomProps {
  tasksByRoom: Record<string, UserTask[]>;
  onToggleTask: (taskId: number, completed: boolean) => void;
  moveOutDate?: string | null;
  keyDeliveryDate?: string | null;
}

export default function TasksByRoom({ 
  tasksByRoom, 
  onToggleTask,
  moveOutDate,
  keyDeliveryDate 
}: TasksByRoomProps) {
  if (Object.keys(tasksByRoom).length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-sm text-gray-500">
          No hay tareas que coincidan con el filtro seleccionado.
        </p>
      </div>
    );
  }

  return (
    <>
      {Object.entries(tasksByRoom).map(([roomName, tasks]) => (
        <div key={roomName} className="bg-white shadow-sm rounded-lg">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900 flex items-center">
              {roomName === 'Generales' ? '⚡' : '🏠'} {roomName} ({tasks.length})
              {tasks.filter(t => t.completed).length > 0 && (
                <span className="ml-2 text-sm text-gray-500">
                  • {tasks.filter(t => t.completed).length}/{tasks.length} completadas
                </span>
              )}
            </h3>
          </div>
          <div className="divide-y divide-gray-200">
            {tasks.map((userTask) => (
              <TaskItem
                key={userTask.id}
                userTask={userTask}
                onToggle={onToggleTask}
                moveOutDate={moveOutDate}
                keyDeliveryDate={keyDeliveryDate}
              />
            ))}
          </div>
        </div>
      ))}
    </>
  );
}
