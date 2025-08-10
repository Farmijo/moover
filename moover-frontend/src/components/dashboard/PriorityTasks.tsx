import Link from 'next/link';
import { PriorityUserTask } from './utils';

interface PriorityTasksProps {
  priorityTasks: PriorityUserTask[];
  onToggleTask: (taskId: number, completed: boolean) => void;
  currentMoveId: number;
}

export default function PriorityTasks({ 
  priorityTasks, 
  onToggleTask, 
  currentMoveId 
}: PriorityTasksProps) {
  if (priorityTasks.length === 0) {
    return null;
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      <div className="px-6 py-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-medium text-gray-900">🚨 Tareas prioritarias</h3>
          <Link
            href={`/dashboard/moves/${currentMoveId}/tasks`}
            className="text-sm text-indigo-600 hover:text-indigo-500"
          >
            Ver todas →
          </Link>
        </div>
      </div>
      <div className="px-6 py-4 space-y-3">
        {priorityTasks.slice(0, 5).map((task) => (
          <div key={task.id} className={`p-4 rounded-lg border-l-4 ${
            task.daysFromNow < 0 ? 'border-red-400 bg-red-50' :
            task.daysFromNow <= 3 ? 'border-orange-400 bg-orange-50' :
            'border-yellow-400 bg-yellow-50'
          }`}>
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-1">
                  <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                    task.daysFromNow < 0 ? 'bg-red-100 text-red-800' :
                    task.daysFromNow <= 3 ? 'bg-orange-100 text-orange-800' :
                    'bg-yellow-100 text-yellow-800'
                  }`}>
                    {task.urgencyReason}
                  </span>
                  {task.room && (
                    <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                      🏠 {task.room.name}
                    </span>
                  )}
                </div>
                <h4 className="text-sm font-medium text-gray-900">{task.name}</h4>
                {task.task?.description && (
                  <p className="text-xs text-gray-600 mt-1">{task.task.description}</p>
                )}
              </div>
              <button
                onClick={() => onToggleTask(task.id, true)}
                className="ml-4 inline-flex items-center px-3 py-1 border border-transparent text-xs font-medium rounded text-indigo-700 bg-indigo-100 hover:bg-indigo-200"
              >
                ✓ Completar
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
