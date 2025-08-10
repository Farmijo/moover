'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { moveService } from '@/lib/services';

export default function MovePage() {
  const router = useRouter();
  const params = useParams();
  const moveId = params.id as string;
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (moveId) {
      const fetchMove = async () => {
        try {
          await moveService.getMove(parseInt(moveId));
          
          // Redirigir al dashboard de la mudanza
          router.replace(`/dashboard/moves/${moveId}`);
        } catch (error) {
          console.error('Error fetching move:', error);
          // Si hay error, redirigir al dashboard general
          router.replace('/dashboard');
        } finally {
          setLoading(false);
        }
      };

      fetchMove();
    }
  }, [moveId, router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#FAF6F3] to-[#F7F9FB] flex items-center justify-center py-6">
        <div className="text-center">
          <div className="animate-spin rounded-full h-20 w-20 border-4 border-[#7C3AED]/20 border-t-[#7C3AED] mx-auto mb-4 shadow-sm"></div>
          <p className="text-lg text-gray-600 mb-2">
            Cargando mudanza...
          </p>
          <p className="text-sm text-gray-500">Un momento por favor</p>
        </div>
      </div>
    );
  }

  return null; // Se redirige automáticamente
}
