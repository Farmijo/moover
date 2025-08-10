interface WarningMessagesProps {
  missingOriginKeyDate: boolean;
  onEditClick: () => void;
}

export default function WarningMessages({ 
  missingOriginKeyDate, 
  onEditClick 
}: WarningMessagesProps) {
  if (!missingOriginKeyDate) {
    return null;
  }

  return (
    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
      <div className="flex">
        <div className="flex-shrink-0">
          <span className="text-yellow-400 text-lg">⚠️</span>
        </div>
        <div className="ml-3">
          <h3 className="text-sm font-medium text-yellow-800">
            Se requiere información adicional
          </h3>
          <div className="mt-2 text-sm text-yellow-700">
            <p>
              La fecha de entrega de llaves del origen es requerida para generar tareas personalizadas.
            </p>
          </div>
          <div className="mt-4">
            <div className="flex space-x-2">
              <button
                onClick={onEditClick}
                className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded text-yellow-800 bg-yellow-100 hover:bg-yellow-200 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2"
              >
                Completar información
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
