'use client';

import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import Link from 'next/link';

export default function Home() {
  const { isAuthenticated, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      if (isAuthenticated) {
        router.push('/dashboard');
      }
    }
  }, [isAuthenticated, loading, router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#FAF6F3] to-[#F7F9FB] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-20 w-20 border-4 border-[#7C3AED]/20 border-t-[#7C3AED] mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando...</p>
        </div>
      </div>
    );
  }

  if (isAuthenticated) {
    return null; // Will redirect to dashboard
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FAF6F3] to-[#F7F9FB]">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <div className="relative z-10 pb-8 sm:pb-16 md:pb-20 lg:max-w-2xl lg:w-full lg:pb-28 xl:pb-32">
            <main className="mt-10 mx-auto max-w-7xl px-4 sm:mt-12 sm:px-6 md:mt-16 lg:mt-20 lg:px-8 xl:mt-28">
              <div className="sm:text-center lg:text-left">
                <div className="flex justify-center lg:justify-start mb-8">
                  <div className="h-20 w-20 bg-gradient-to-br from-[#7C3AED]/20 to-[#3B82F6]/20 rounded-xl flex items-center justify-center border border-[#7C3AED]/20">
                    <span className="text-4xl">🏠</span>
                  </div>
                </div>
                <h1 className="text-4xl tracking-tight font-extrabold text-gray-900 sm:text-5xl md:text-6xl">
                  <span className="block xl:inline">Organiza tu</span>{' '}
                  <span className="block bg-gradient-to-r from-[#7C3AED] to-[#3B82F6] bg-clip-text text-transparent xl:inline">mudanza perfecta</span>
                </h1>
                <p className="mt-6 text-base text-gray-600 sm:mt-5 sm:text-lg sm:max-w-xl sm:mx-auto md:mt-5 md:text-xl lg:mx-0">
                  Con Moover, gestionar tu mudanza es simple y eficiente. Organiza tus tareas,
                  gestiona tus habitaciones y mantén todo bajo control durante tu proceso de mudanza.
                </p>
                <div className="mt-8 sm:mt-8 sm:flex sm:justify-center lg:justify-start gap-4">
                  <Link
                    href="/auth/signup"
                    className="w-full sm:w-auto flex items-center justify-center px-8 py-4 border-0 text-base font-semibold rounded-xl text-white bg-gradient-to-r from-[#7C3AED] to-[#3B82F6] hover:from-[#7C3AED]/90 hover:to-[#3B82F6]/90 shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105"
                  >
                    ✨ Empezar gratis
                  </Link>
                  <Link
                    href="/auth/login"
                    className="w-full sm:w-auto flex items-center justify-center px-8 py-4 border-2 border-[#7C3AED]/20 text-base font-semibold rounded-xl text-[#7C3AED] bg-white hover:border-[#7C3AED] hover:bg-[#7C3AED]/5 transition-all duration-200"
                  >
                    Iniciar sesión →
                  </Link>
                </div>
              </div>
            </main>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:text-center mb-16">
            <h2 className="text-base bg-gradient-to-r from-[#7C3AED] to-[#3B82F6] bg-clip-text text-transparent font-semibold tracking-wide uppercase mb-2">Características</h2>
            <p className="text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
              Todo lo que necesitas para tu mudanza
            </p>
          </div>

          <div className="mt-10">
            <div className="space-y-10 md:space-y-0 md:grid md:grid-cols-3 md:gap-x-8 md:gap-y-10">
              <div className="relative bg-white rounded-xl p-8 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-200">
                <div className="absolute -top-4 left-8 flex items-center justify-center h-12 w-12 rounded-xl bg-gradient-to-r from-[#7C3AED] to-[#3B82F6] text-white shadow-lg">
                  📋
                </div>
                <p className="mt-4 text-lg leading-6 font-semibold text-gray-900 mb-2">Gestión de tareas</p>
                <p className="text-base text-gray-600">
                  Organiza todas las tareas de tu mudanza con plantillas predefinidas y personalizables.
                </p>
              </div>

              <div className="relative bg-white rounded-xl p-8 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-200">
                <div className="absolute -top-4 left-8 flex items-center justify-center h-12 w-12 rounded-xl bg-gradient-to-r from-[#34D399] to-[#34D399]/80 text-white shadow-lg">
                  🏠
                </div>
                <p className="mt-4 text-lg leading-6 font-semibold text-gray-900 mb-2">Gestión por habitaciones</p>
                <p className="text-base text-gray-600">
                  Organiza tu mudanza habitación por habitación para no olvidar nada.
                </p>
              </div>

              <div className="relative bg-white rounded-xl p-8 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-200">
                <div className="absolute -top-4 left-8 flex items-center justify-center h-12 w-12 rounded-xl bg-gradient-to-r from-[#FCD34D] to-[#FCD34D]/80 text-white shadow-lg">
                  📊
                </div>
                <p className="mt-4 text-lg leading-6 font-semibold text-gray-900 mb-2">Seguimiento de progreso</p>
                <p className="text-base text-gray-600">
                  Visualiza el progreso de tu mudanza en tiempo real con estadísticas detalladas.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
