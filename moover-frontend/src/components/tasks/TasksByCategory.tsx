import { UserTask } from '@/types/api';
import TaskItem from './TaskItem';

interface TasksByCategoryProps {
  tasksByCategory: Record<string, UserTask[]>;
  onToggleTask: (taskId: number, completed: boolean) => void;
  moveOutDate?: string | null;
  keyDeliveryDate?: string | null;
}

export default function TasksByCategory({ 
  tasksByCategory, 
  onToggleTask,
  moveOutDate,
  keyDeliveryDate 
}: TasksByCategoryProps) {
  if (Object.keys(tasksByCategory).length === 0) {
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
      {Object.entries(tasksByCategory).map(([category, tasks]) => (
        <div key={category} className="bg-white shadow-sm rounded-lg">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">
              📁 {category} ({tasks.length})
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
