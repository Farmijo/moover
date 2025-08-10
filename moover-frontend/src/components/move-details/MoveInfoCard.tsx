import { Move } from '@/types/api';

interface MoveInfoCardProps {
  move: Move;
  completedTasks: number;
  totalTasks: number;
  progressPercentage: number;
}

export default function MoveInfoCard({ 
  move, 
  completedTasks, 
  totalTasks, 
  progressPercentage 
}: MoveInfoCardProps) {
  const getMoveTypeText = (moveType: string) => {
    switch (moveType) {
      case 'apartment':
        return 'Piso/Apartamento';
      case 'house':
        return 'Casa';
      case 'office':
        return 'Oficina';
      case 'storage':
        return 'Trastero';
      case 'other':
        return 'Otro';
      default:
        return moveType;
    }
  };

  return (
    <div className="bg-white shadow-sm rounded-lg">
      <div className="px-6 py-4 border-b border-gray-200">
        <h3 className="text-lg leading-6 font-medium text-gray-900">
          Información de la mudanza
        </h3>
      </div>
      <div className="px-6 py-4">
        <dl className="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2">
          <div>
            <dt className="text-sm font-medium text-gray-500">Dirección de origen</dt>
            <dd className="mt-1 text-sm text-gray-900">{move.origin_address}</dd>
          </div>
          <div>
            <dt className="text-sm font-medium text-gray-500">Dirección de destino</dt>
            <dd className="mt-1 text-sm text-gray-900">{move.destination_address}</dd>
          </div>
          <div>
            <dt className="text-sm font-medium text-gray-500">Tipo de mudanza</dt>
            <dd className="mt-1 text-sm text-gray-900">{getMoveTypeText(move.move_type)}</dd>
          </div>
          <div>
            <dt className="text-sm font-medium text-gray-500">Progreso</dt>
            <dd className="mt-1 text-sm text-gray-900">
              <div className="flex items-center">
                <div className="w-full bg-gray-200 rounded-full h-2.5 mr-2">
                  <div 
                    className="bg-indigo-600 h-2.5 rounded-full" 
                    style={{ width: `${progressPercentage}%` }}
                  ></div>
                </div>
                <span className="text-sm font-medium text-gray-900">{progressPercentage}%</span>
              </div>
              <p className="mt-1 text-xs text-gray-500">
                {completedTasks} de {totalTasks} tareas completadas
              </p>
            </dd>
          </div>
          {move.destination_key_delivery_date && (
            <div>
              <dt className="text-sm font-medium text-gray-500">Entrega llaves destino</dt>
              <dd className="mt-1 text-sm text-gray-900">
                {new Date(move.destination_key_delivery_date).toLocaleDateString('es-ES')}
              </dd>
            </div>
          )}
          {move.origin_move_out_date && (
            <div>
              <dt className="text-sm font-medium text-gray-500">Fecha de salida</dt>
              <dd className="mt-1 text-sm text-gray-900">
                {new Date(move.origin_move_out_date).toLocaleDateString('es-ES')}
              </dd>
            </div>
          )}
        </dl>
      </div>
    </div>
  );
}
