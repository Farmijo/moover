'use client';

import { useAuth } from '@/context/AuthContext';
import { useRouter, usePathname } from 'next/navigation';
import { useEffect, ReactNode, useState } from 'react';
import Link from 'next/link';
import DashboardNavigation from '@/components/dashboard/DashboardNavigation';
import { moveService } from '@/lib/services';

interface DashboardLayoutProps {
  children: ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const { isAuthenticated, loading, user, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [checkingMoves, setCheckingMoves] = useState(false);

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push('/auth/login');
    }
  }, [isAuthenticated, loading, router]);

  // Only redirect to onboarding from the main dashboard page, not from specific move pages
  useEffect(() => {
    const shouldCheckMoves = pathname === '/dashboard' && isAuthenticated && !loading;
    
    if (shouldCheckMoves) {
      setCheckingMoves(true);
      
      const checkUserMoves = async () => {
        try {
          const response = await moveService.getAllMoves();
          const moves = response.moves || [];
          
          // Only redirect to onboarding if on main dashboard and no moves exist
          if (moves.length === 0) {
            router.push('/onboarding');
          }
        } catch (error) {
          console.error('Error checking moves:', error);
          // Don't redirect on error
        } finally {
          setCheckingMoves(false);
        }
      };

      checkUserMoves();
    }
  }, [isAuthenticated, loading, pathname, router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-blue-50 flex items-center justify-center py-6">
        <div className="text-center">
          <div className="animate-spin rounded-full h-20 w-20 border-4 border-purple-200 border-t-purple-600 mx-auto mb-4 shadow-sm"></div>
          <p className="text-lg text-gray-600 mb-2">Cargando...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null; // Will redirect
  }

  if (checkingMoves) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-blue-50 flex items-center justify-center py-6">
        <div className="text-center">
          <div className="animate-spin rounded-full h-20 w-20 border-4 border-purple-200 border-t-purple-600 mx-auto mb-4 shadow-sm"></div>
          <p className="text-lg text-gray-600 mb-2">Verificando mudanzas...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-blue-50">
      {/* Top Navigation Bar */}
      <nav className="bg-white bg-opacity-80 backdrop-blur-sm border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Link href="/dashboard" className="flex-shrink-0">
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 bg-gradient-to-br from-purple-100 to-blue-100 rounded-lg flex items-center justify-center border border-purple-200 shadow-sm">
                    <span className="text-lg">🏠</span>
                  </div>
                  <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">Moover</h1>
                </div>
              </Link>
            </div>
            
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-600">
                Hola, {user?.email}
              </span>
              <button
                onClick={logout}
                className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium shadow-md hover:shadow-lg transition-all duration-200 hover:scale-105"
              >
                Cerrar sesión
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Dashboard Navigation */}
      <DashboardNavigation />

      {/* Main content */}
      <main className="max-w-7xl mx-auto py-2 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          {children}
        </div>
      </main>
    </div>
  );
}
