'use client';

import { useEffect, useState, useRef } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { moveService } from '@/lib/services';

interface MoveRouterProps {
  children: React.ReactNode;
}

export default function MoveRouter({ children }: MoveRouterProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [loading, setLoading] = useState(true);
  const [shouldRedirect, setShouldRedirect] = useState(false);
  const hasCheckedRef = useRef(false);

  useEffect(() => {
    let isMounted = true;

    const checkMoveStatus = async () => {
      // Skip if already checked
      if (hasCheckedRef.current) {
        if (isMounted) setLoading(false);
        return;
      }

      // Skip router logic for certain paths
      const skipPaths = ['/login', '/signup', '/profile', '/auth'];
      if (skipPaths.some(path => pathname.startsWith(path))) {
        if (isMounted) setLoading(false);
        return;
      }

      hasCheckedRef.current = true;

      try {
        console.log('🔍 Checking move status for path:', pathname);
        const response = await moveService.getAllMoves();
        
        if (!isMounted) return;
        
        const moves = response.moves || [];
        
        // Categorize moves
        const activeMoves = moves.filter(move => 
          move.status === 'planning' || move.status === 'in_progress'
        );
        const completedMoves = moves.filter(move => move.status === 'completed');
        
        console.log('📊 Move analysis:', {
          total: moves.length,
          active: activeMoves.length,
          completed: completedMoves.length,
          currentPath: pathname
        });

        // Routing logic
        if (activeMoves.length > 0) {
          // User has active moves - go to dashboard
          if (pathname !== '/dashboard') {
            console.log('➡️ Redirecting to dashboard (active moves found)');
            setShouldRedirect(true);
            setTimeout(() => {
              if (isMounted) router.replace('/dashboard');
            }, 100);
            return;
          }
        } else if (completedMoves.length > 0 && moves.length === completedMoves.length) {
          // User has ONLY completed moves - go to completed page
          if (pathname !== '/moves/completed' && pathname !== '/onboarding') {
            console.log('➡️ Redirecting to completed moves (only completed moves found)');
            setShouldRedirect(true);
            setTimeout(() => {
              if (isMounted) router.replace('/moves/completed');
            }, 100);
            return;
          }
        } else if (moves.length === 0) {
          // User has no moves - go to onboarding
          if (pathname !== '/onboarding') {
            console.log('➡️ Redirecting to onboarding (no moves found)');
            setShouldRedirect(true);
            setTimeout(() => {
              if (isMounted) router.replace('/onboarding');
            }, 100);
            return;
          }
        }

        // If we reach here, user is on the correct page
        console.log('✅ User is on correct page for their move status');
        if (isMounted) setLoading(false);

      } catch (err) {
        console.error('❌ Error checking move status:', err);
        // On error, don't redirect - let user stay where they are
        if (isMounted) setLoading(false);
      }
    };

    // Timeout de seguridad
    const timeoutId = setTimeout(() => {
      console.warn('⚠️ MoveRouter timeout reached, hiding loading');
      if (isMounted) setLoading(false);
    }, 8000);

    checkMoveStatus();

    return () => {
      isMounted = false;
      clearTimeout(timeoutId);
    };
  }, [pathname, router]);

  // Show loading screen while checking
  if (loading || shouldRedirect) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#FAF6F3] to-[#F7F9FB] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-[#7C3AED]/20 border-t-[#7C3AED] mx-auto mb-4"></div>
          <p className="text-lg text-gray-600 mb-2">Cargando tu progreso...</p>
          <p className="text-sm text-gray-500 mb-6">Un momento por favor</p>
          
          {/* Emergency skip button */}
          <button
            onClick={() => {
              console.log('🚨 Emergency skip activated');
              setLoading(false);
              setShouldRedirect(false);
            }}
            className="text-sm text-[#7C3AED] hover:text-[#3B82F6] transition-colors duration-200 underline"
          >
            Continuar sin verificar
          </button>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
