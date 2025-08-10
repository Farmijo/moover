'use client';

import { useState, useEffect } from 'react';
import { moveService, userTaskService } from '@/lib/services';
import { Move, UserTask } from '@/types/api';
import TimelineView from '@/components/timeline/TimelineView';
import EmptyTimelineState from '@/components/timeline/EmptyTimelineState';

export default function TimelinePage() {
  const [currentMove, setCurrentMove] = useState<Move | null>(null);
  const [userTasks, setUserTasks] = useState<UserTask[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadTimelineData = async () => {
      try {
        // Get current move
        const moveResponse = await moveService.getCurrentMove();
        setCurrentMove(moveResponse.move);

        // If there's a current move, get user tasks
        if (moveResponse.move) {
          const userTasksResponse = await userTaskService.getUserTasks(moveResponse.move.id);
          setUserTasks(userTasksResponse);
        }
      } catch (err) {
        console.error('Error loading timeline:', err);
        setError('Error al cargar la línea de tiempo');
      } finally {
        setLoading(false);
      }
    };

    loadTimelineData();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
        {error}
      </div>
    );
  }

  if (!currentMove) {
    return <EmptyTimelineState />;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Línea de tiempo</h1>
        <p className="mt-2 text-lg text-gray-600">
          Planificación semanal de tu mudanza a {currentMove.destination_address.split(',')[0]}
        </p>
      </div>

      <TimelineView 
        move={currentMove} 
        userTasks={userTasks}
      />
    </div>
  );
}
