import Link from 'next/link';
import { Move } from '@/types/api';

interface TasksHeaderProps {
  move: Move | null;
  moveId: string;
  totalTasks: number;
  completedTasks: number;
  progressPercentage: number;
  onGenerateTasks: () => void;
  generatingTasks: boolean;
  canGenerateTasks: boolean;
}

export default function TasksHeader({ 
  move, 
  moveId, 
  totalTasks, 
  completedTasks, 
  progressPercentage,
  onGenerateTasks,
  generatingTasks,
  canGenerateTasks
}: TasksHeaderProps) {
  return (
    <div className="md:flex md:items-center md:justify-between">
      <div className="flex-1 min-w-0">
        <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">
          Tareas de la mudanza
        </h2>
        <p className="mt-1 text-sm text-gray-500">
          {move && `${move.origin_address} → ${move.destination_address}`}
        </p>
        {totalTasks > 0 && (
          <div className="mt-2 flex items-center">
            <div className="w-64 bg-gray-200 rounded-full h-2 mr-3">
              <div 
                className="bg-indigo-600 h-2 rounded-full" 
                style={{ width: `${progressPercentage}%` }}
              ></div>
            </div>
            <span className="text-sm text-gray-600">
              {completedTasks}/{totalTasks} completadas ({progressPercentage}%)
            </span>
          </div>
        )}
      </div>
      <div className="mt-4 flex md:mt-0 md:ml-4 space-x-3">

        {totalTasks === 0 && (
          <button
            onClick={onGenerateTasks}
            disabled={generatingTasks || !canGenerateTasks}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
            title={!canGenerateTasks ? 'Se requiere definir la fecha de entrega de llaves del origen' : ''}
          >
            {generatingTasks ? (
              <>
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="m4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Generando tareas...
              </>
            ) : (
              'Generar tareas'
            )}
          </button>
        )}
      </div>
    </div>
  );
}
