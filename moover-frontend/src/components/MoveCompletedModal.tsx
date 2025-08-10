import { useEffect, useState } from 'react';

interface MoveCompletedModalProps {
  isOpen: boolean;
  onClose: () => void;
  moveTitle?: string;
}

export default function MoveCompletedModal({ 
  isOpen, 
  onClose, 
  moveTitle = "Tu mudanza" 
}: MoveCompletedModalProps) {
  const [showConfetti, setShowConfetti] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setShowConfetti(true);
      // Auto-cerrar después de 8 segundos si no se cierra manualmente
      const timer = setTimeout(() => {
        onClose();
      }, 8000);
      
      return () => clearTimeout(timer);
    }
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/40 backdrop-blur-sm transition-opacity duration-300"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="flex min-h-full items-center justify-center p-4 text-center">
        <div className="w-full max-w-md transform overflow-hidden rounded-lg bg-white p-8 text-left align-middle shadow-lg transition-all duration-300 animate-in zoom-in-95">
          
          {/* Confetti Effect */}
          {showConfetti && (
            <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-lg">
              {[...Array(30)].map((_, i) => (
                <div
                  key={i}
                  className="absolute animate-bounce text-lg"
                  style={{
                    left: `${Math.random() * 90 + 5}%`,
                    top: `${Math.random() * 90 + 5}%`,
                    animationDelay: `${Math.random() * 2}s`,
                    animationDuration: `${2 + Math.random() * 2}s`,
                  }}
                >
                  {['🎉', '🎊', '✨', '🌟', '🎈', '🏆'][Math.floor(Math.random() * 6)]}
                </div>
              ))}
            </div>
          )}

          <div className="text-center relative z-10">
            {/* Success Icon */}
            <div className="mx-auto mb-6 h-20 w-20 bg-gradient-to-br from-[#34D399]/20 to-[#34D399]/10 rounded-lg flex items-center justify-center border border-[#34D399]/20 shadow-md animate-pulse">
              <span className="text-5xl">🎉</span>
            </div>

            {/* Title */}
            <h3 className="text-3xl font-bold bg-gradient-to-r from-[#34D399] to-[#34D399]/80 bg-clip-text text-transparent mb-4">
              ¡Felicitaciones!
            </h3>

            {/* Message */}
            <div className="gap-y-4 space-y-4 mb-8">
              <p className="text-lg text-gray-700 font-medium">
                Has completado todas las tareas de {moveTitle.toLowerCase()}
              </p>
              <p className="text-base text-gray-600">
                Tu mudanza ha sido marcada como <span className="font-semibold text-[#34D399]">completada</span>. 
                ¡Esperamos que tu nueva etapa sea increíble! ✨
              </p>
            </div>

            {/* Achievement Stats */}
            <div className="bg-gradient-to-r from-[#34D399]/10 to-[#34D399]/5 rounded-lg p-6 mb-6 border border-[#34D399]/20">
              <div className="flex items-center justify-center gap-6">
                <div className="text-center">
                  <div className="text-2xl font-bold bg-gradient-to-r from-[#34D399] to-[#34D399]/80 bg-clip-text text-transparent">100%</div>
                  <div className="text-xs text-gray-600 uppercase tracking-wide">Completado</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold bg-gradient-to-r from-[#3B82F6] to-[#7C3AED] bg-clip-text text-transparent">✓</div>
                  <div className="text-xs text-gray-600 uppercase tracking-wide">Tareas</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold bg-gradient-to-r from-[#FCD34D] to-[#FCD34D]/80 bg-clip-text text-transparent">🏆</div>
                  <div className="text-xs text-gray-600 uppercase tracking-wide">Logro</div>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="gap-y-3 space-y-3">
              <button
                type="button"
                className="w-full inline-flex justify-center px-6 py-3 border-0 text-base font-semibold rounded-lg text-white bg-gradient-to-r from-[#34D399] to-[#34D399]/80 hover:from-[#34D399]/90 hover:to-[#34D399]/70 shadow-md hover:shadow-lg transition-all duration-200 hover:scale-105"
                onClick={onClose}
              >
                🎊 ¡Genial!
              </button>
              
              <p className="text-xs text-gray-500">
                Este modal se cerrará automáticamente
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
