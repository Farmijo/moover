'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { moveService } from '@/lib/services';
import { Move } from '@/types/api';

export default function CompletedMovesPage() {
  const router = useRouter();
  const [completedMoves, setCompletedMoves] = useState<Move[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchCompletedMoves = async () => {
      try {
        const response = await moveService.getAllMoves();
        const completed = response.moves?.filter(move => move.status === 'completed') || [];
        setCompletedMoves(completed);
      } catch (err) {
        console.error('Error fetching completed moves:', err);
        setError('Error al cargar las mudanzas completadas');
      } finally {
        setLoading(false);
      }
    };

    fetchCompletedMoves();
  }, []);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const handleNewMove = () => {
    router.push('/onboarding');
  };

  const handleViewMove = (moveId: number) => {
    router.push(`/moves/${moveId}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#FAF6F3] to-[#F7F9FB] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-20 w-20 border-4 border-[#7C3AED]/20 border-t-[#7C3AED] mx-auto mb-4"></div>
          <p className="text-lg text-gray-600">Cargando mudanzas completadas...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#FAF6F3] to-[#F7F9FB] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <div className="bg-gradient-to-r from-[#F87171]/10 to-[#F87171]/5 border border-[#F87171]/20 rounded-xl p-8 max-w-md mx-auto">
            <span className="text-4xl mb-4 block">⚠️</span>
            <h2 className="text-xl font-bold text-gray-900 mb-2">Error</h2>
            <p className="text-gray-600 mb-4">{error}</p>
            <button
              onClick={() => router.push('/dashboard')}
              className="bg-gradient-to-r from-[#7C3AED] to-[#3B82F6] text-white py-2 px-6 rounded-lg hover:from-[#7C3AED]/90 hover:to-[#3B82F6]/90 transition-all duration-200"
            >
              Ir al Dashboard
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FAF6F3] to-[#F7F9FB] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="mx-auto h-20 w-20 bg-gradient-to-br from-[#34D399]/20 to-[#10B981]/20 rounded-full flex items-center justify-center mb-6">
            <span className="text-4xl">🎉</span>
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-[#34D399] to-[#10B981] bg-clip-text text-transparent mb-4">
            ¡Mudanzas completadas!
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Has completado {completedMoves.length} mudanza{completedMoves.length !== 1 ? 's' : ''} con éxito. 
            ¿Listo para la siguiente aventura?
          </p>
        </div>

        {/* Completed Moves List */}
        <div className="space-y-6 mb-8">
          {completedMoves.map((move, index) => (
            <div key={move.id} className="bg-white rounded-xl shadow-lg border border-gray-100 p-6 hover:shadow-xl transition-all duration-300">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center mb-2">
                    <span className="text-2xl mr-3">✅</span>
                    <h3 className="text-xl font-bold text-gray-900">
                      Mudanza #{index + 1}
                    </h3>
                    <span className="ml-3 inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gradient-to-r from-[#34D399]/10 to-[#10B981]/10 text-[#10B981] border border-[#34D399]/20">
                      Completada
                    </span>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center text-gray-600">
                      <span className="text-sm mr-2">📍</span>
                      <span className="text-sm">
                        <strong>Origen:</strong> {move.origin_address}
                      </span>
                    </div>
                    <div className="flex items-center text-gray-600">
                      <span className="text-sm mr-2">🏠</span>
                      <span className="text-sm">
                        <strong>Destino:</strong> {move.destination_address}
                      </span>
                    </div>
                    {move.origin_move_out_date && (
                      <div className="flex items-center text-gray-600">
                        <span className="text-sm mr-2">📅</span>
                        <span className="text-sm">
                          <strong>Fecha de mudanza:</strong> {formatDate(move.origin_move_out_date)}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="flex gap-3">
                  <button
                    onClick={() => handleViewMove(move.id)}
                    className="bg-gradient-to-r from-[#7C3AED]/10 to-[#3B82F6]/10 text-[#7C3AED] py-2 px-4 rounded-lg hover:from-[#7C3AED]/20 hover:to-[#3B82F6]/20 border border-[#7C3AED]/20 transition-all duration-200 text-sm font-medium"
                  >
                    Ver detalles
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Actions */}
        <div className="text-center">
          <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-8 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              ¿Necesitas hacer otra mudanza?
            </h2>
            <p className="text-gray-600 mb-6">
              Puedes crear una nueva mudanza en cualquier momento. Te ayudaremos a organizarla paso a paso.
            </p>
            <div className="flex gap-4 justify-center">
              <button
                onClick={handleNewMove}
                className="bg-gradient-to-r from-[#7C3AED] to-[#3B82F6] text-white py-3 px-8 rounded-xl hover:from-[#7C3AED]/90 hover:to-[#3B82F6]/90 focus:ring-2 focus:ring-[#7C3AED]/50 focus:ring-offset-2 font-medium shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105"
              >
                ✨ Crear nueva mudanza
              </button>
              <button
                onClick={() => router.push('/history')}
                className="bg-white text-gray-700 py-3 px-8 rounded-xl border-2 border-gray-200 hover:border-gray-300 focus:ring-2 focus:ring-gray-200 font-medium transition-all duration-200"
              >
                📊 Ver historial completo
              </button>
              <button
                onClick={() => router.push('/dashboard')}
                className="bg-white text-gray-700 py-3 px-8 rounded-xl border-2 border-gray-200 hover:border-gray-300 focus:ring-2 focus:ring-gray-200 font-medium transition-all duration-200"
              >
                Ir al Dashboard
              </button>
            </div>
          </div>
        </div>

        {/* Stats Card */}
        <div className="bg-gradient-to-br from-[#34D399]/10 to-[#10B981]/5 border border-[#34D399]/20 rounded-xl p-6">
          <div className="text-center">
            <span className="text-3xl mb-2 block">📊</span>
            <h3 className="text-lg font-semibold text-[#10B981] mb-2">
              Tu historial de mudanzas
            </h3>
            <p className="text-gray-700 text-sm">
              Has completado <strong>{completedMoves.length}</strong> mudanza{completedMoves.length !== 1 ? 's' : ''} usando Moover. 
              ¡Eres todo un experto en mudanzas! 🏆
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
