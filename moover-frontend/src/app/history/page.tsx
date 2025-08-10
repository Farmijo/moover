'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { moveService } from '@/lib/services';
import { Move } from '@/types/api';

export default function HistoryPage() {
  const router = useRouter();
  const [allMoves, setAllMoves] = useState<Move[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchAllMoves = async () => {
      try {
        const response = await moveService.getAllMoves();
        setAllMoves(response.moves || []);
      } catch (err) {
        console.error('Error fetching moves:', err);
        setError('Error al cargar el historial de mudanzas');
      } finally {
        setLoading(false);
      }
    };

    fetchAllMoves();
  }, []);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'planning':
        return 'bg-gradient-to-r from-[#F59E0B]/10 to-[#F59E0B]/5 text-[#F59E0B] border-[#F59E0B]/20';
      case 'in_progress':
        return 'bg-gradient-to-r from-[#3B82F6]/10 to-[#3B82F6]/5 text-[#3B82F6] border-[#3B82F6]/20';
      case 'completed':
        return 'bg-gradient-to-r from-[#34D399]/10 to-[#10B981]/5 text-[#10B981] border-[#34D399]/20';
      default:
        return 'bg-gradient-to-r from-gray/10 to-gray/5 text-gray-600 border-gray/20';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'planning':
        return 'Planificando';
      case 'in_progress':
        return 'En progreso';
      case 'completed':
        return 'Completada';
      default:
        return status;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'planning':
        return '📋';
      case 'in_progress':
        return '🔄';
      case 'completed':
        return '✅';
      default:
        return '📦';
    }
  };

  const handleViewMove = (moveId: number) => {
    router.push(`/moves/${moveId}`);
  };

  const handleNewMove = () => {
    router.push('/onboarding');
  };

  const activeMoves = allMoves.filter(move => 
    move.status === 'planning' || move.status === 'in_progress'
  );
  const completedMoves = allMoves.filter(move => move.status === 'completed');

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#FAF6F3] to-[#F7F9FB] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-20 w-20 border-4 border-[#7C3AED]/20 border-t-[#7C3AED] mx-auto mb-4"></div>
          <p className="text-lg text-gray-600">Cargando historial de mudanzas...</p>
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
              Volver
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FAF6F3] to-[#F7F9FB] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-12">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-[#7C3AED] to-[#3B82F6] bg-clip-text text-transparent mb-4">
              Historial de Mudanzas
            </h1>
            <p className="text-lg text-gray-600">
              Todas tus mudanzas: {activeMoves.length} activas, {completedMoves.length} completadas
            </p>
          </div>
          <button
            onClick={handleNewMove}
            className="bg-gradient-to-r from-[#7C3AED] to-[#3B82F6] text-white py-3 px-6 rounded-xl hover:from-[#7C3AED]/90 hover:to-[#3B82F6]/90 focus:ring-2 focus:ring-[#7C3AED]/50 focus:ring-offset-2 font-medium shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105"
          >
            ✨ Nueva mudanza
          </button>
        </div>

        {/* Quick Actions */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Mudanzas activas</h3>
              <span className="text-2xl">🔄</span>
            </div>
            <p className="text-3xl font-bold bg-gradient-to-r from-[#3B82F6] to-[#3B82F6]/80 bg-clip-text text-transparent">
              {activeMoves.length}
            </p>
            {activeMoves.length > 0 && (
              <button
                onClick={() => router.push('/dashboard')}
                className="mt-4 text-sm text-[#3B82F6] hover:text-[#3B82F6]/80 font-medium"
              >
                Ver dashboard →
              </button>
            )}
          </div>

          <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Completadas</h3>
              <span className="text-2xl">✅</span>
            </div>
            <p className="text-3xl font-bold bg-gradient-to-r from-[#34D399] to-[#10B981] bg-clip-text text-transparent">
              {completedMoves.length}
            </p>
          </div>

          <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Total</h3>
              <span className="text-2xl">📊</span>
            </div>
            <p className="text-3xl font-bold bg-gradient-to-r from-[#7C3AED] to-[#3B82F6] bg-clip-text text-transparent">
              {allMoves.length}
            </p>
          </div>
        </div>

        {/* Moves List */}
        {allMoves.length === 0 ? (
          <div className="text-center py-16">
            <span className="text-6xl mb-6 block">📦</span>
            <h3 className="text-2xl font-bold text-gray-900 mb-4">No tienes mudanzas aún</h3>
            <p className="text-gray-600 mb-8">¡Crea tu primera mudanza para comenzar!</p>
            <button
              onClick={handleNewMove}
              className="bg-gradient-to-r from-[#7C3AED] to-[#3B82F6] text-white py-3 px-8 rounded-xl hover:from-[#7C3AED]/90 hover:to-[#3B82F6]/90 font-medium shadow-lg hover:shadow-xl transition-all duration-200"
            >
              ✨ Crear primera mudanza
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            {allMoves.map((move, index) => (
              <div key={move.id} className="bg-white rounded-xl shadow-lg border border-gray-100 p-6 hover:shadow-xl transition-all duration-300">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center mb-3">
                      <span className="text-2xl mr-3">{getStatusIcon(move.status)}</span>
                      <h3 className="text-xl font-bold text-gray-900 mr-4">
                        Mudanza #{index + 1}
                      </h3>
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(move.status)}`}>
                        {getStatusLabel(move.status)}
                      </span>
                    </div>
                    
                    <div className="grid md:grid-cols-2 gap-4 mb-4">
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
                      </div>
                      
                      <div className="space-y-2">
                        {move.origin_move_out_date && (
                          <div className="flex items-center text-gray-600">
                            <span className="text-sm mr-2">📅</span>
                            <span className="text-sm">
                              <strong>Fecha:</strong> {formatDate(move.origin_move_out_date)}
                            </span>
                          </div>
                        )}
                        <div className="flex items-center text-gray-600">
                          <span className="text-sm mr-2">🕒</span>
                          <span className="text-sm">
                            <strong>Creada:</strong> {formatDate(move.created_at)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex gap-3 ml-6">
                    <button
                      onClick={() => handleViewMove(move.id)}
                      className="bg-gradient-to-r from-[#7C3AED]/10 to-[#3B82F6]/10 text-[#7C3AED] py-2 px-4 rounded-lg hover:from-[#7C3AED]/20 hover:to-[#3B82F6]/20 border border-[#7C3AED]/20 transition-all duration-200 text-sm font-medium"
                    >
                      Ver detalles
                    </button>
                    {move.status !== 'completed' && (
                      <button
                        onClick={() => router.push('/dashboard')}
                        className="bg-gradient-to-r from-[#7C3AED] to-[#3B82F6] text-white py-2 px-4 rounded-lg hover:from-[#7C3AED]/90 hover:to-[#3B82F6]/90 transition-all duration-200 text-sm font-medium"
                      >
                        Gestionar
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
