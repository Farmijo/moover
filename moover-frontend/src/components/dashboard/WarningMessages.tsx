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
    <div className="bg-gradient-to-r from-[#FCD34D]/10 to-[#FCD34D]/5 border border-[#FCD34D]/30 rounded-xl p-6 mb-6">
      <div className="flex">
        <div className="flex-shrink-0">
          <span className="text-[#FCD34D] text-xl">⚠️</span>
        </div>
        <div className="ml-4">
          <h3 className="text-sm font-semibold text-gray-900 mb-2">
            Se requiere información adicional
          </h3>
          <div className="text-sm text-gray-700 mb-4">
            <p>
              La fecha de entrega de llaves del origen es requerida para generar tareas personalizadas.
            </p>
          </div>
          <div>
            <button
              onClick={onEditClick}
              className="inline-flex items-center px-4 py-2 border-0 text-xs font-medium rounded-xl text-white bg-gradient-to-r from-[#FCD34D] to-[#FCD34D]/80 hover:from-[#FCD34D]/90 hover:to-[#FCD34D]/70 focus:outline-none focus:ring-2 focus:ring-[#FCD34D]/50 focus:ring-offset-2 transition-all duration-200 hover:scale-105 shadow-md"
            >
              ✨ Completar información
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
