'use client';

import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect, ReactNode, useState } from 'react';
import { moveService } from '@/lib/services';

interface OnboardingLayoutProps {
  children: ReactNode;
}

export default function OnboardingLayout({ children }: OnboardingLayoutProps) {
  const { isAuthenticated, loading } = useAuth();
  const router = useRouter();
  const [checkingMoves, setCheckingMoves] = useState(true);
  const [hasMoves, setHasMoves] = useState<boolean | null>(null);

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push('/auth/login');
    }
  }, [isAuthenticated, loading, router]);

  // Check if user has moves - if they do, redirect to dashboard
  useEffect(() => {
    const checkUserMoves = async () => {
      if (isAuthenticated && !loading) {
        try {
          const response = await moveService.getCurrentMove();
          setHasMoves(!!response.move);
        } catch {
          // If there's an error getting moves, assume no moves (allow onboarding)
          setHasMoves(false);
        } finally {
          setCheckingMoves(false);
        }
      }
    };

    checkUserMoves();
  }, [isAuthenticated, loading]);

  // Redirect to dashboard if user already has moves
  useEffect(() => {
    if (!checkingMoves && hasMoves === true && isAuthenticated) {
      router.push('/dashboard');
    }
  }, [checkingMoves, hasMoves, isAuthenticated, router]);

  if (loading || checkingMoves) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 to-blue-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated || hasMoves === true) {
    return null; // Will redirect
  }

  return (
    <div className="min-h-screen">
      {children}
    </div>
  );
}
