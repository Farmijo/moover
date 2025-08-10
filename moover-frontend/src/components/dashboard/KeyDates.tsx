import { Move } from '@/types/api';
import { formatDate, getRelativeDate } from './utils';

interface KeyDatesProps {
  currentMove: Move;
}

export default function KeyDates({ currentMove }: KeyDatesProps) {
  // Don't render if no key dates are defined
  if (!currentMove.origin_move_out_date && 
      !currentMove.destination_key_delivery_date && 
      !currentMove.origin_key_delivery_date) {
    return null;
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      <div className="px-6 py-4 border-b border-gray-200">
        <h3 className="text-lg font-medium text-gray-900">📅 Fechas clave</h3>
      </div>
      <div className="px-6 py-4">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          {currentMove.origin_key_delivery_date && (
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <div className="text-2xl mb-2">🗝️</div>
              <div className="text-sm font-medium text-gray-900">Entrega llaves origen</div>
              <div className="text-sm text-gray-600">{formatDate(currentMove.origin_key_delivery_date)}</div>
              <div className="text-xs text-blue-600 font-medium">{getRelativeDate(currentMove.origin_key_delivery_date)}</div>
            </div>
          )}
          {currentMove.origin_move_out_date && (
            <div className="text-center p-4 bg-orange-50 rounded-lg">
              <div className="text-2xl mb-2">📦</div>
              <div className="text-sm font-medium text-gray-900">Fecha de mudanza</div>
              <div className="text-sm text-gray-600">{formatDate(currentMove.origin_move_out_date)}</div>
              <div className="text-xs text-orange-600 font-medium">{getRelativeDate(currentMove.origin_move_out_date)}</div>
            </div>
          )}
          {currentMove.destination_key_delivery_date && (
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="text-2xl mb-2">🏡</div>
              <div className="text-sm font-medium text-gray-900">Acceso nuevo hogar</div>
              <div className="text-sm text-gray-600">{formatDate(currentMove.destination_key_delivery_date)}</div>
              <div className="text-xs text-green-600 font-medium">{getRelativeDate(currentMove.destination_key_delivery_date)}</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
