'use client';

import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect, ReactNode, useState } from 'react';
import Link from 'next/link';
import DashboardNavigation from '@/components/dashboard/DashboardNavigation';
import { moveService } from '@/lib/services';
import { Move } from '@/types/api';

interface DashboardLayoutProps {
  children: ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const { isAuthenticated, loading, user, logout } = useAuth();
  const router = useRouter();
  const [checkingMoves, setCheckingMoves] = useState(true);
  const [hasMoves, setHasMoves] = useState<boolean | null>(null);

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push('/auth/login');
    }
  }, [isAuthenticated, loading, router]);

  // Check if user has moves
  useEffect(() => {
    const checkUserMoves = async () => {
      if (isAuthenticated && !loading) {
        try {
          const response = await moveService.getCurrentMove();
          setHasMoves(!!response.move);
        } catch {
          // If there's an error getting moves, assume no moves
          setHasMoves(false);
        } finally {
          setCheckingMoves(false);
        }
      }
    };

    checkUserMoves();
  }, [isAuthenticated, loading]);

  // Redirect to onboarding if no moves
  useEffect(() => {
    if (!checkingMoves && hasMoves === false && isAuthenticated) {
      router.push('/onboarding');
    }
  }, [checkingMoves, hasMoves, isAuthenticated, router]);

  if (loading || checkingMoves) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (!isAuthenticated || hasMoves === false) {
    return null; // Will redirect
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Top Navigation Bar */}
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Link href="/dashboard" className="flex-shrink-0">
                <h1 className="text-2xl font-bold text-indigo-600">Moover</h1>
              </Link>
            </div>
            
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-700">
                Hola, {user?.email}
              </span>
              <button
                onClick={logout}
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-3 py-2 rounded-md text-sm font-medium"
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
