'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { 
  HomeIcon, 
  CheckIcon, 
  CalendarDaysIcon, 
  InformationCircleIcon 
} from '@heroicons/react/24/outline';
import { moveService } from '@/lib/services';
import { Move } from '@/types/api';

export default function DashboardNavigation() {
  const pathname = usePathname();
  const [currentMove, setCurrentMove] = useState<Move | null>(null);

  useEffect(() => {
    const fetchCurrentMove = async () => {
      try {
        const response = await moveService.getCurrentMove();
        if (response.move) {
          setCurrentMove(response.move);
        }
      } catch (error) {
        console.error('Error fetching current move:', error);
      }
    };

    fetchCurrentMove();
  }, []);

  const navigationItems = [
    {
      name: 'Dashboard',
      href: '/dashboard',
      icon: HomeIcon,
      current: pathname === '/dashboard'
    },
    {
      name: 'Tareas',
      href: currentMove ? `/dashboard/moves/${currentMove.id}/tasks` : '/dashboard',
      icon: CheckIcon,
      current: currentMove ? pathname === `/dashboard/moves/${currentMove.id}/tasks` : false,
      disabled: !currentMove
    },
    {
      name: 'Timeline',
      href: '/dashboard/timeline',
      icon: CalendarDaysIcon,
      current: pathname === '/dashboard/timeline',
      disabled: !currentMove
    },
    {
      name: 'Detalles',
      href: currentMove ? `/dashboard/moves/${currentMove.id}` : '/dashboard',
      icon: InformationCircleIcon,
      current: currentMove ? pathname === `/dashboard/moves/${currentMove.id}` : false,
      disabled: !currentMove
    }
  ];

  return (
    <div className="bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Mi Mudanza</h1>
            <p className="text-sm text-gray-500">Gestiona todos los aspectos de tu mudanza</p>
          </div>
        </div>
        
        <nav className="-mb-px flex space-x-8" aria-label="Navegación del dashboard">
          {navigationItems.map((item) => {
            const Icon = item.icon;
            
            if (item.disabled) {
              return (
                <div
                  key={item.name}
                  className="border-transparent text-gray-400 whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 cursor-not-allowed"
                >
                  <Icon className="h-5 w-5" />
                  <span>{item.name}</span>
                </div>
              );
            }
            
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`${
                  item.current
                    ? 'border-indigo-500 text-indigo-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                } whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 transition-colors`}
              >
                <Icon className="h-5 w-5" />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>
      </div>
    </div>
  );
}
