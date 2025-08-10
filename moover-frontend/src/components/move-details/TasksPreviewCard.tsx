import Link from 'next/link';
import { Move, UserTask } from '@/types/api';

interface TasksPreviewCardProps {
  move: Move;
  userTasks: UserTask[];
  totalTasks: number;
  onGenerateTasks: () => void;
  generatingTasks: boolean;
  canGenerateTasks: boolean;
}

export default function TasksPreviewCard({ 
  move, 
  userTasks, 
  totalTasks, 
  onGenerateTasks,
  generatingTasks,
  canGenerateTasks
}: TasksPreviewCardProps) {
  const handleTaskToggle = (taskId: number) => {
    // Esta función se implementaría para cambiar el estado de la tarea
    console.log('Toggle task:', taskId);
  };

  return (
    <div className="bg-white shadow-sm rounded-lg">
      <div className="px-6 py-4 border-b border-gray-200">
        <h3 className="text-lg leading-6 font-medium text-gray-900">
          Tareas ({totalTasks})
        </h3>
      </div>
      <div className="px-6 py-4">
        {userTasks.length === 0 ? (
          <div className="text-center">
            <p className="text-sm text-gray-500 mb-4">
              No hay tareas generadas aún. Genera tareas automáticamente basadas en tu mudanza.
            </p>
            <button
              onClick={onGenerateTasks}
              disabled={generatingTasks || !canGenerateTasks}
              className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
              title={!canGenerateTasks ? 'Se requiere definir la fecha de entrega de llaves del origen' : ''}
            >
              {generatingTasks ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="m4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Generando...
                </>
              ) : (
                'Generar tareas'
              )}
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            {userTasks.slice(0, 5).map((userTask) => (
              <div key={userTask.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    checked={userTask.completed}
                    onChange={() => handleTaskToggle(userTask.id)}
                    className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                  />
                  <div className="ml-3">
                    <p className={`text-sm ${userTask.completed ? 'line-through text-gray-500' : 'text-gray-900'}`}>
                      {userTask.name}
                    </p>
                    {userTask.task?.description && (
                      <p className="text-xs text-gray-500">{userTask.task.description}</p>
                    )}
                  </div>
                </div>
                <div className="text-xs text-gray-400">
                  {userTask.task?.category || 'General'}
                </div>
              </div>
            ))}
            
            {userTasks.length > 5 && (
              <div className="text-center pt-4">
                <Link
                  href={`/dashboard/moves/${move.id}/tasks`}
                  className="text-sm text-indigo-600 hover:text-indigo-900"
                >
                  Ver todas las tareas ({userTasks.length})
                </Link>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
