import { UserTask } from '@/types/api';
import TaskItem from './TaskItem';

interface GeneralTasksViewProps {
  generalTasks: UserTask[];
  onToggleTask: (taskId: number, completed: boolean) => void;
  moveOutDate?: string | null;
  keyDeliveryDate?: string | null;
}

export default function GeneralTasksView({ 
  generalTasks, 
  onToggleTask,
  moveOutDate,
  keyDeliveryDate 
}: GeneralTasksViewProps) {
  return (
    <div className="bg-white shadow-sm rounded-lg">
      <div className="px-6 py-4 border-b border-gray-200">
        <h3 className="text-lg font-medium text-gray-900">
          ⚡ Tareas Generales ({generalTasks.length})
        </h3>
        <p className="text-sm text-gray-500 mt-1">
          Tareas que aplican a toda la mudanza, no específicas de habitaciones
        </p>
      </div>
      {generalTasks.length === 0 ? (
        <div className="px-6 py-8 text-center">
          <p className="text-gray-500">No hay tareas generales en esta mudanza.</p>
        </div>
      ) : (
        <div className="divide-y divide-gray-200">
          {generalTasks.map((userTask) => (
            <TaskItem
              key={userTask.id}
              userTask={userTask}
              onToggle={onToggleTask}
              moveOutDate={moveOutDate}
              keyDeliveryDate={keyDeliveryDate}
            />
          ))}
        </div>
      )}
    </div>
  );
}
