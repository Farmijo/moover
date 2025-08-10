import { UserTask } from '@/types/api';

interface TasksFiltersProps {
  viewMode: 'all' | 'by-room' | 'general';
  filter: 'all' | 'pending' | 'completed' | 'overdue';
  onViewModeChange: (mode: 'all' | 'by-room' | 'general') => void;
  onFilterChange: (filter: 'all' | 'pending' | 'completed' | 'overdue') => void;
  userTasks: UserTask[];
  getUniqueRooms: () => string[];
  generalTasks: UserTask[];
  roomTasks: UserTask[];
}

export default function TasksFilters({ 
  viewMode, 
  filter, 
  onViewModeChange, 
  onFilterChange, 
  userTasks,
  getUniqueRooms,
  generalTasks,
  roomTasks
}: TasksFiltersProps) {
  const getTasksForViewMode = () => {
    switch (viewMode) {
      case 'all': return userTasks;
      case 'by-room': return roomTasks;
      case 'general': return generalTasks;
      default: return userTasks;
    }
  };

  const currentTasks = getTasksForViewMode();

  return (
    <div className="bg-white shadow-sm rounded-lg p-4">
      <h3 className="text-sm font-medium text-gray-900 mb-3">Vista</h3>
      <div className="flex space-x-4 mb-4">
        <button
          onClick={() => onViewModeChange('all')}
          className={`px-4 py-2 rounded-md text-sm font-medium border ${
            viewMode === 'all' 
              ? 'bg-indigo-600 text-white border-indigo-600' 
              : 'text-gray-700 border-gray-300 hover:bg-gray-50'
          }`}
        >
          📋 Todas las tareas
        </button>
        <button
          onClick={() => onViewModeChange('by-room')}
          className={`px-4 py-2 rounded-md text-sm font-medium border ${
            viewMode === 'by-room' 
              ? 'bg-indigo-600 text-white border-indigo-600' 
              : 'text-gray-700 border-gray-300 hover:bg-gray-50'
          }`}
        >
          🏠 Por habitación ({getUniqueRooms().length} habitaciones)
        </button>
        <button
          onClick={() => onViewModeChange('general')}
          className={`px-4 py-2 rounded-md text-sm font-medium border ${
            viewMode === 'general' 
              ? 'bg-indigo-600 text-white border-indigo-600' 
              : 'text-gray-700 border-gray-300 hover:bg-gray-50'
          }`}
        >
          ⚡ Solo generales ({generalTasks.length})
        </button>
      </div>
      
      {/* Filtros de estado (solo si no estamos en vista general) */}
      {viewMode !== 'general' && (
        <>
          <h4 className="text-sm font-medium text-gray-700 mb-2">Filtrar por estado</h4>
          <div className="flex space-x-4">
            <button
              onClick={() => onFilterChange('all')}
              className={`px-3 py-2 rounded-md text-sm font-medium ${
                filter === 'all' 
                  ? 'bg-indigo-100 text-indigo-700' 
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Todas ({currentTasks.length})
            </button>
            <button
              onClick={() => onFilterChange('pending')}
              className={`px-3 py-2 rounded-md text-sm font-medium ${
                filter === 'pending' 
                  ? 'bg-indigo-100 text-indigo-700' 
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Pendientes ({currentTasks.filter(t => !t.completed).length})
            </button>
            <button
              onClick={() => onFilterChange('completed')}
              className={`px-3 py-2 rounded-md text-sm font-medium ${
                filter === 'completed' 
                  ? 'bg-indigo-100 text-indigo-700' 
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Completadas ({currentTasks.filter(t => t.completed).length})
            </button>
            <button
              onClick={() => onFilterChange('overdue')}
              className={`px-3 py-2 rounded-md text-sm font-medium ${
                filter === 'overdue' 
                  ? 'bg-indigo-100 text-indigo-700' 
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Vencidas ({currentTasks.filter(t => !t.completed && t.due_date && new Date(t.due_date) < new Date()).length})
            </button>
          </div>
        </>
      )}
    </div>
  );
}
