'use client';

import { CalendarDaysIcon, KeyIcon, TruckIcon } from '@heroicons/react/24/outline';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { TimelineMilestone } from './utils';

interface TimelineMilestonesProps {
  milestones: TimelineMilestone[];
}

export default function TimelineMilestones({ milestones }: TimelineMilestonesProps) {
  if (milestones.length === 0) {
    return null;
  }

  const getMilestoneIcon = (type: TimelineMilestone['type']) => {
    switch (type) {
      case 'origin_key':
        return <KeyIcon className="h-5 w-5 text-blue-600" />;
      case 'move_out':
        return <TruckIcon className="h-5 w-5 text-orange-600" />;
      case 'destination_key':
        return <KeyIcon className="h-5 w-5 text-green-600" />;
      default:
        return <CalendarDaysIcon className="h-5 w-5 text-gray-600" />;
    }
  };

  const getMilestoneColor = (type: TimelineMilestone['type']) => {
    switch (type) {
      case 'origin_key':
        return 'bg-blue-50 border-blue-200';
      case 'move_out':
        return 'bg-orange-50 border-orange-200';
      case 'destination_key':
        return 'bg-green-50 border-green-200';
      default:
        return 'bg-gray-50 border-gray-200';
    }
  };

  const getMilestoneTitleColor = (type: TimelineMilestone['type']) => {
    switch (type) {
      case 'origin_key':
        return 'text-blue-800';
      case 'move_out':
        return 'text-orange-800';
      case 'destination_key':
        return 'text-green-800';
      default:
        return 'text-gray-800';
    }
  };

  const getMilestoneDescColor = (type: TimelineMilestone['type']) => {
    switch (type) {
      case 'origin_key':
        return 'text-blue-600';
      case 'move_out':
        return 'text-orange-600';
      case 'destination_key':
        return 'text-green-600';
      default:
        return 'text-gray-600';
    }
  };

  // Sort milestones by date
  const sortedMilestones = [...milestones].sort((a, b) => a.date.getTime() - b.date.getTime());

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4">
      <div className="flex items-center mb-4">
        <CalendarDaysIcon className="h-5 w-5 text-gray-700 mr-2" />
        <h3 className="text-lg font-medium text-gray-900">Hitos Importantes</h3>
      </div>
      
      <div className="space-y-3">
        {sortedMilestones.map((milestone, index) => {
          const isUpcoming = milestone.date > new Date();
          const isPast = milestone.date < new Date();
          
          return (
            <div 
              key={index}
              className={`border rounded-lg p-3 transition-all ${getMilestoneColor(milestone.type)} ${
                isPast ? 'opacity-60' : isUpcoming ? 'ring-1 ring-offset-1 ring-indigo-200' : ''
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  {getMilestoneIcon(milestone.type)}
                  <div>
                    <h4 className={`font-medium ${getMilestoneTitleColor(milestone.type)}`}>
                      {milestone.title}
                    </h4>
                    <p className={`text-sm ${getMilestoneDescColor(milestone.type)}`}>
                      {milestone.description}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className={`text-sm font-medium ${getMilestoneTitleColor(milestone.type)}`}>
                    {format(milestone.date, 'dd MMM yyyy', { locale: es })}
                  </p>
                  <p className={`text-xs ${getMilestoneDescColor(milestone.type)}`}>
                    {format(milestone.date, 'EEEE', { locale: es })}
                  </p>
                  {isPast && (
                    <span className="inline-block mt-1 text-xs bg-gray-200 text-gray-600 px-2 py-1 rounded">
                      Completado
                    </span>
                  )}
                  {isUpcoming && (
                    <span className="inline-block mt-1 text-xs bg-indigo-100 text-indigo-700 px-2 py-1 rounded">
                      Próximo
                    </span>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
      
      {sortedMilestones.length === 0 && (
        <div className="text-center py-8 text-gray-400">
          <CalendarDaysIcon className="h-12 w-12 mx-auto mb-4 text-gray-300" />
          <p className="text-sm">No hay hitos configurados</p>
        </div>
      )}
    </div>
  );
}
