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
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      <div className="px-6 py-4 border-b border-gray-200">
        <h3 className="text-lg font-medium text-gray-900">⚙️ Acciones rápidas</h3>
      </div>
      <div className="px-6 py-4 space-y-3">
        <Link
          href={`/dashboard/moves/${currentMoveId}/rooms/new`}
          className="w-full inline-flex items-center justify-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
        >
          🏠 Añadir habitación
        </Link>
        
        {taskSummary && taskSummary.summary.total_tasks > 0 && (
          <button
            onClick={onGenerateTasks}
            disabled={generatingTasks || !canGenerateTasks}
            className="w-full inline-flex items-center justify-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            title={!canGenerateTasks ? 'Se requiere definir la fecha de entrega de llaves del origen' : ''}
          >
            {generatingTasks ? '⏳ Regenerando...' : '🔄 Regenerar tareas'}
          </button>
        )}
        
        <Link
          href={`/dashboard/moves/${currentMoveId}`}
          className="w-full inline-flex items-center justify-center px-4 py-2 border border-indigo-300 shadow-sm text-sm font-medium rounded-md text-indigo-700 bg-indigo-50 hover:bg-indigo-100"
        >
          ⚙️ Gestionar mudanza
        </Link>
      </div>
    </div>
  );
}
