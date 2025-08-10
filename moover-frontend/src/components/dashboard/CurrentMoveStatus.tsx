import Link from 'next/link';
import { Move, TaskSummary } from '@/types/api';

interface CurrentMoveStatusProps {
  currentMove: Move;
  taskSummary: TaskSummary | null;
  onGenerateTasks: () => void;
  generatingTasks: boolean;
  canGenerateTasks: boolean;
}

export default function CurrentMoveStatus({ 
  currentMove, 
  taskSummary, 
  onGenerateTasks,
  generatingTasks,
  canGenerateTasks
}: CurrentMoveStatusProps) {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      <div className="px-6 py-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center">
              <span className="text-2xl">🏠</span>
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900">
                Mudanza a {currentMove.destination_address.split(',')[0]}
              </h2>
              <div className="flex items-center space-x-4 mt-1">
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  currentMove.status === 'planning' 
                    ? 'bg-yellow-100 text-yellow-800'
                    : currentMove.status === 'in_progress'
                    ? 'bg-blue-100 text-blue-800'
                    : 'bg-green-100 text-green-800'
                }`}>
                  {currentMove.status === 'planning' && '📝 Planificando'}
                  {currentMove.status === 'in_progress' && '🚀 En progreso'}
                  {currentMove.status === 'completed' && '✅ Completada'}
                </span>
                {taskSummary && (
                  <span className="text-sm text-gray-600">
                    {taskSummary.summary.progress_percentage}% completado ({taskSummary.summary.completed_tasks}/{taskSummary.summary.total_tasks} tareas)
                  </span>
                )}
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            {(!taskSummary || taskSummary.summary.total_tasks === 0) && (
              <button
                onClick={onGenerateTasks}
                disabled={generatingTasks || !canGenerateTasks}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
                title={!canGenerateTasks ? 'Se requiere definir la fecha de entrega de llaves del origen' : ''}
              >
                {generatingTasks ? '⏳ Generando...' : '⚡ Generar tareas'}
              </button>
            )}
            <Link
              href={`/dashboard/moves/${currentMove.id}`}
              className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
            >
              Ver detalles
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
