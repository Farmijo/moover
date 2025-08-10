import { TaskSummary } from '@/types/api';

interface StatsCardsProps {
  taskSummary: TaskSummary;
}

export default function StatsCards({ taskSummary }: StatsCardsProps) {
  return (
    <div className="grid grid-cols-1 gap-y-6 gap-x-6 sm:grid-cols-3">
      <div className="bg-white rounded-lg shadow-md border border-gray-100 p-8 hover:shadow-lg transition-all duration-200">
        <div className="flex items-center">
          <div className="flex-shrink-0">
            <div className="w-12 h-12 bg-gradient-to-br from-[#34D399]/20 to-[#34D399]/10 rounded-lg flex items-center justify-center border border-[#34D399]/20">
              <span className="text-[#34D399] text-lg">✓</span>
            </div>
          </div>
          <div className="ml-4">
            <p className="text-sm font-medium text-gray-500">Completadas</p>
            <p className="text-3xl font-bold bg-gradient-to-r from-[#34D399] to-[#34D399]/80 bg-clip-text text-transparent">
              {taskSummary.summary.completed_tasks}
            </p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md border border-gray-100 p-8 hover:shadow-lg transition-all duration-200">
        <div className="flex items-center">
          <div className="flex-shrink-0">
            <div className="w-12 h-12 bg-gradient-to-br from-[#3B82F6]/20 to-[#3B82F6]/10 rounded-lg flex items-center justify-center border border-[#3B82F6]/20">
              <span className="text-[#3B82F6] text-lg">📊</span>
            </div>
          </div>
          <div className="ml-4">
            <p className="text-sm font-medium text-gray-500">Progreso</p>
            <p className="text-3xl font-bold bg-gradient-to-r from-[#3B82F6] to-[#7C3AED] bg-clip-text text-transparent">
              {taskSummary.summary.progress_percentage}%
            </p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md border border-gray-100 p-8 hover:shadow-lg transition-all duration-200">
        <div className="flex items-center">
          <div className="flex-shrink-0">
            <div className="w-12 h-12 bg-gradient-to-br from-[#F87171]/20 to-[#F87171]/10 rounded-lg flex items-center justify-center border border-[#F87171]/20">
              <span className="text-[#F87171] text-lg">⚠️</span>
            </div>
          </div>
          <div className="ml-4">
            <p className="text-sm font-medium text-gray-500">Atrasadas</p>
            <p className="text-3xl font-bold bg-gradient-to-r from-[#F87171] to-[#F87171]/80 bg-clip-text text-transparent">
              {taskSummary.summary.overdue_tasks}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
