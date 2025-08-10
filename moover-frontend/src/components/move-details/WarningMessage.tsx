interface WarningMessageProps {
  canGenerateTasks: boolean;
  onEditClick: () => void;
}

export default function WarningMessage({ canGenerateTasks, onEditClick }: WarningMessageProps) {
  if (canGenerateTasks) {
    return null;
  }

  return (
    <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded">
      ⚠️ Para generar y calcular las tareas correctamente, es necesario definir la fecha de entrega de llaves del piso de origen.{' '}
      <button
        onClick={onEditClick}
        className="font-medium underline hover:no-underline"
      >
        Configurar fechas →
      </button>
    </div>
  );
}
