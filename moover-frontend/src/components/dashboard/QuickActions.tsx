import Link from 'next/link';
import { TaskSummary } from '@/types/api';

interface QuickActionsProps {
  currentMoveId: number;
  taskSummary: TaskSummary | null;
  onGenerateTasks: () => void;
  generatingTasks: boolean;
  canGenerateTasks: boolean;
}

export default function QuickActions({ 
  currentMoveId, 
  taskSummary, 
  onGenerateTasks,
  generatingTasks,
  canGenerateTasks
}: QuickActionsProps) {
  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-100">
      <div className="px-8 py-6 border-b border-gray-100">
        <h3 className="text-lg font-semibold bg-gradient-to-r from-[#7C3AED] to-[#3B82F6] bg-clip-text text-transparent">⚙️ Acciones rápidas</h3>
      </div>
      <div className="px-8 py-6 space-y-4">
        <Link
          href={`/dashboard/moves/${currentMoveId}/rooms/new`}
          className="w-full inline-flex items-center justify-center px-6 py-3 border-2 border-gray-200 shadow-sm text-sm font-medium rounded-xl text-gray-700 bg-white hover:border-[#7C3AED]/30 hover:text-[#7C3AED] transition-all duration-200"
        >
          🏠 Añadir habitación
        </Link>
        
        {taskSummary && taskSummary.summary.total_tasks > 0 && (
          <button
            onClick={onGenerateTasks}
            disabled={generatingTasks || !canGenerateTasks}
            className="w-full inline-flex items-center justify-center px-6 py-3 border-2 border-gray-200 shadow-sm text-sm font-medium rounded-xl text-gray-700 bg-white hover:border-[#FCD34D]/30 hover:text-[#FCD34D] disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
            title={!canGenerateTasks ? 'Se requiere definir la fecha de entrega de llaves del origen' : ''}
          >
            {generatingTasks ? '⏳ Regenerando...' : '🔄 Regenerar tareas'}
          </button>
        )}
        
        <Link
          href={`/dashboard/moves/${currentMoveId}`}
          className="w-full inline-flex items-center justify-center px-6 py-3 border-0 shadow-lg text-sm font-medium rounded-xl text-white bg-gradient-to-r from-[#7C3AED] to-[#3B82F6] hover:from-[#7C3AED]/90 hover:to-[#3B82F6]/90 hover:shadow-xl transition-all duration-200"
        >
          ⚙️ Gestionar mudanza
        </Link>
      </div>
    </div>
  );
}
