'use client';

import { useEffect, useRef } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { moveService } from '@/lib/services';

export function useMoveRedirect() {
  const router = useRouter();
  const pathname = usePathname();
  const hasCheckedRef = useRef(false);

  useEffect(() => {
    const checkAndRedirect = async () => {
      // Skip if already checked or on auth pages
      if (hasCheckedRef.current) return;
      
      const skipPaths = ['/login', '/signup', '/profile', '/auth'];
      if (skipPaths.some(path => pathname.startsWith(path))) {
        return;
      }

      hasCheckedRef.current = true;

      try {
        console.log('🔍 Hook checking move status for path:', pathname);
        const response = await moveService.getAllMoves();
        const moves = response.moves || [];
        
        const activeMoves = moves.filter(move => 
          move.status === 'planning' || move.status === 'in_progress'
        );
        const completedMoves = moves.filter(move => move.status === 'completed');
        
        console.log('📊 Hook move analysis:', {
          total: moves.length,
          active: activeMoves.length,
          completed: completedMoves.length,
          currentPath: pathname
        });

        // Redirect logic
        if (activeMoves.length > 0 && pathname !== '/dashboard') {
          console.log('➡️ Hook redirecting to dashboard');
          router.replace('/dashboard');
        } else if (completedMoves.length > 0 && moves.length === completedMoves.length) {
          if (pathname !== '/moves/completed' && pathname !== '/onboarding') {
            console.log('➡️ Hook redirecting to completed moves');
            router.replace('/moves/completed');
          }
        } else if (moves.length === 0 && pathname !== '/onboarding') {
          console.log('➡️ Hook redirecting to onboarding');
          router.replace('/onboarding');
        }

      } catch (err) {
        console.error('❌ Hook error checking moves:', err);
      }
    };

    // Delay execution to avoid conflicts
    const timeoutId = setTimeout(checkAndRedirect, 100);
    return () => clearTimeout(timeoutId);
  }, []);

  return hasCheckedRef.current;
}
