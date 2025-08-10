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
    <div className="bg-white rounded-xl shadow-lg border border-gray-100">
      <div className="px-8 py-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-gradient-to-br from-[#7C3AED]/20 to-[#3B82F6]/20 rounded-xl flex items-center justify-center">
              <span className="text-2xl">🏠</span>
            </div>
            <div>
              <h2 className="text-xl font-semibold bg-gradient-to-r from-[#7C3AED] to-[#3B82F6] bg-clip-text text-transparent">
                Mudanza a {currentMove.destination_address.split(',')[0]}
              </h2>
              <div className="flex items-center space-x-4 mt-1">
                <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                  currentMove.status === 'planning' 
                    ? 'bg-gradient-to-r from-[#FCD34D]/20 to-[#FCD34D]/10 text-[#FCD34D] border border-[#FCD34D]/30'
                    : currentMove.status === 'in_progress'
                    ? 'bg-gradient-to-r from-[#3B82F6]/20 to-[#3B82F6]/10 text-[#3B82F6] border border-[#3B82F6]/30'
                    : 'bg-gradient-to-r from-[#34D399]/20 to-[#34D399]/10 text-[#34D399] border border-[#34D399]/30'
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
                className="inline-flex items-center px-6 py-3 border-0 text-sm font-medium rounded-xl shadow-lg text-white bg-gradient-to-r from-[#7C3AED] to-[#3B82F6] hover:from-[#7C3AED]/90 hover:to-[#3B82F6]/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 hover:shadow-xl"
                title={!canGenerateTasks ? 'Se requiere definir la fecha de entrega de llaves del origen' : ''}
              >
                {generatingTasks ? '⏳ Generando...' : '⚡ Generar tareas'}
              </button>
            )}
            <Link
              href={`/dashboard/moves/${currentMove.id}`}
              className="inline-flex items-center px-6 py-3 border-2 border-gray-200 text-sm font-medium rounded-xl text-gray-700 bg-white hover:border-[#7C3AED]/30 hover:text-[#7C3AED] transition-all duration-200"
            >
              Ver detalles →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
