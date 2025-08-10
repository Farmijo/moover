'use client';

import { ChevronDownIcon, ChevronRightIcon } from '@heroicons/react/24/outline';
import { useState } from 'react';
import { TimelineWeek as TimelineWeekType } from './utils';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

interface TimelineWeekProps {
  week: TimelineWeekType;
}

export default function TimelineWeek({ week }: TimelineWeekProps) {
  const [isExpanded, setIsExpanded] = useState(week.isCurrentWeek);

  const priorityColors = {
    high: 'border-l-red-500 bg-red-50',
    medium: 'border-l-yellow-500 bg-yellow-50',
    low: 'border-l-green-500 bg-green-50'
  };

  const priorityTextColors = {
    high: 'text-red-700',
    medium: 'text-yellow-700',
    low: 'text-green-700'
  };

  const weekLabel = format(week.startDate, 'dd MMM', { locale: es }) + 
                    ' - ' + 
                    format(week.endDate, 'dd MMM yyyy', { locale: es });

  const taskCount = week.tasks.length;
  const milestoneCount = week.milestones.length;

  return (
    <div className={`border rounded-lg overflow-hidden ${
      week.isCurrentWeek 
        ? 'border-indigo-200 bg-indigo-50' 
        : 'border-gray-200 bg-white'
    }`}>
      {/* Week Header */}
      <div 
        className={`px-4 py-3 cursor-pointer transition-colors ${
          week.isCurrentWeek 
            ? 'bg-indigo-100 hover:bg-indigo-200' 
            : 'bg-gray-50 hover:bg-gray-100'
        }`}
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            {isExpanded ? (
              <ChevronDownIcon className="h-5 w-5 text-gray-400" />
            ) : (
              <ChevronRightIcon className="h-5 w-5 text-gray-400" />
            )}
            <div>
              <h3 className={`font-medium ${
                week.isCurrentWeek ? 'text-indigo-800' : 'text-gray-900'
              }`}>
                Semana {week.weekNumber}
              </h3>
              <p className={`text-sm ${
                week.isCurrentWeek ? 'text-indigo-600' : 'text-gray-500'
              }`}>
                {weekLabel}
              </p>
            </div>
            {week.isCurrentWeek && (
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-200 text-indigo-800">
                Semana Actual
              </span>
            )}
          </div>
          <div className="flex items-center space-x-4 text-sm">
            {taskCount > 0 && (
              <span className={`${
                week.isCurrentWeek ? 'text-indigo-600' : 'text-gray-600'
              }`}>
                {taskCount} tarea{taskCount !== 1 ? 's' : ''}
              </span>
            )}
            {milestoneCount > 0 && (
              <span className={`${
                week.isCurrentWeek ? 'text-indigo-600' : 'text-gray-600'
              }`}>
                {milestoneCount} hito{milestoneCount !== 1 ? 's' : ''}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Week Content */}
      {isExpanded && (
        <div className="px-4 py-3 space-y-3">
          {/* Milestones */}
          {week.milestones.length > 0 && (
            <div className="space-y-2">
              <h4 className="text-sm font-medium text-gray-700 flex items-center">
                🎯 Hitos
              </h4>
              {week.milestones.map((milestone, index) => (
                <div 
                  key={index}
                  className="flex items-center justify-between p-2 bg-purple-50 border border-purple-200 rounded-md"
                >
                  <span className="text-sm font-medium text-purple-800">
                    {milestone.title}
                  </span>
                  <span className="text-xs text-purple-600">
                    {format(milestone.date, 'dd MMM', { locale: es })}
                  </span>
                </div>
              ))}
            </div>
          )}

          {/* Tasks */}
          {week.tasks.length > 0 && (
            <div className="space-y-2">
              <h4 className="text-sm font-medium text-gray-700 flex items-center">
                ✅ Tareas
              </h4>
              {week.tasks.map((task) => (
                <div 
                  key={task.id}
                  className={`border-l-4 pl-3 py-2 rounded-r-md ${priorityColors[task.priority]}`}
                >
                  <div className="flex items-center justify-between">
                    <span className={`text-sm font-medium ${priorityTextColors[task.priority]}`}>
                      {task.name}
                    </span>
                    <div className="flex items-center space-x-2">
                      <span className="text-xs text-gray-500 capitalize">
                        {task.priority === 'high' ? 'Alta' : 
                         task.priority === 'medium' ? 'Media' : 'Baja'}
                      </span>
                      {task.room && (
                        <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                          {task.room}
                        </span>
                      )}
                    </div>
                  </div>
                  {task.dueDate && (
                    <p className="text-xs text-gray-500 mt-1">
                      Vence: {format(task.dueDate, 'dd MMM yyyy', { locale: es })}
                    </p>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Empty state */}
          {week.tasks.length === 0 && week.milestones.length === 0 && (
            <div className="text-center py-8 text-gray-400">
              <p className="text-sm">No hay tareas ni hitos programados para esta semana</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
