'use client';

import { useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';

export default function MoveTasksPage() {
  const router = useRouter();
  const params = useParams();
  const moveId = params.id as string;

  useEffect(() => {
    if (moveId) {
      // Redirigir a la ruta correcta del dashboard
      router.replace(`/dashboard/moves/${moveId}/tasks`);
    }
  }, [moveId, router]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FAF6F3] to-[#F7F9FB] flex items-center justify-center py-6">
      <div className="text-center">
        <div className="animate-spin rounded-full h-20 w-20 border-4 border-[#7C3AED]/20 border-t-[#7C3AED] mx-auto mb-4 shadow-sm"></div>
        <p className="text-lg text-gray-600 mb-2">
          Redirigiendo a las tareas...
        </p>
      </div>
    </div>
  );
}
