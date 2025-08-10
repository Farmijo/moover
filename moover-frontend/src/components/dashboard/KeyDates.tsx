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
    <div className="bg-white rounded-xl shadow-lg border border-gray-100">
      <div className="px-8 py-6 border-b border-gray-100">
        <h3 className="text-lg font-semibold bg-gradient-to-r from-[#7C3AED] to-[#3B82F6] bg-clip-text text-transparent">📅 Fechas clave</h3>
      </div>
      <div className="px-8 py-6">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
          {currentMove.origin_key_delivery_date && (
            <div className="text-center p-6 bg-gradient-to-br from-[#3B82F6]/10 to-[#3B82F6]/5 border border-[#3B82F6]/20 rounded-xl">
              <div className="text-2xl mb-3">🗝️</div>
              <div className="text-sm font-semibold text-gray-900 mb-1">Entrega llaves origen</div>
              <div className="text-sm text-gray-600 mb-2">{formatDate(currentMove.origin_key_delivery_date)}</div>
              <div className="text-xs text-[#3B82F6] font-medium px-2 py-1 bg-[#3B82F6]/10 rounded-full">{getRelativeDate(currentMove.origin_key_delivery_date)}</div>
            </div>
          )}
          {currentMove.origin_move_out_date && (
            <div className="text-center p-6 bg-gradient-to-br from-[#FCD34D]/10 to-[#FCD34D]/5 border border-[#FCD34D]/20 rounded-xl">
              <div className="text-2xl mb-3">📦</div>
              <div className="text-sm font-semibold text-gray-900 mb-1">Fecha de mudanza</div>
              <div className="text-sm text-gray-600 mb-2">{formatDate(currentMove.origin_move_out_date)}</div>
              <div className="text-xs text-[#FCD34D] font-medium px-2 py-1 bg-[#FCD34D]/10 rounded-full">{getRelativeDate(currentMove.origin_move_out_date)}</div>
            </div>
          )}
          {currentMove.destination_key_delivery_date && (
            <div className="text-center p-6 bg-gradient-to-br from-[#34D399]/10 to-[#34D399]/5 border border-[#34D399]/20 rounded-xl">
              <div className="text-2xl mb-3">🏡</div>
              <div className="text-sm font-semibold text-gray-900 mb-1">Acceso nuevo hogar</div>
              <div className="text-sm text-gray-600 mb-2">{formatDate(currentMove.destination_key_delivery_date)}</div>
              <div className="text-xs text-[#34D399] font-medium px-2 py-1 bg-[#34D399]/10 rounded-full">{getRelativeDate(currentMove.destination_key_delivery_date)}</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
