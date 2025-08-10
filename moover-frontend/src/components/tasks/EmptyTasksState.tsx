interface EmptyTasksStateProps {
  onGenerateTasks: () => void;
  generatingTasks: boolean;
  canGenerateTasks: boolean;
}

export default function EmptyTasksState({ 
  onGenerateTasks, 
  generatingTasks, 
  canGenerateTasks 
}: EmptyTasksStateProps) {
  return (
    <div className="text-center bg-white shadow-sm rounded-lg py-12">
      <div className="mx-auto h-12 w-12 text-gray-400">
        <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
        </svg>
      </div>
      <h3 className="mt-2 text-sm font-medium text-gray-900">No hay tareas generadas</h3>
      <p className="mt-1 text-sm text-gray-500">
        Genera tareas automáticamente basadas en tu mudanza y habitaciones.
      </p>
      <div className="mt-6">
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
              Generando tareas...
            </>
          ) : (
            'Generar tareas'
          )}
        </button>
      </div>
    </div>
  );
}
