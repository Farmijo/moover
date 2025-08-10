import { Move, UserTask } from '@/types/api';
import { generateTimelineWeeks, TimelineWeek as TimelineWeekType } from './utils';
import TimelineWeek from './TimelineWeek';
import TimelineMilestones from './TimelineMilestones';

interface TimelineViewProps {
  move: Move;
  userTasks: UserTask[];
}

export default function TimelineView({ move, userTasks }: TimelineViewProps) {
  // Generate weeks from move creation to final date
  const weeks = generateTimelineWeeks(move, userTasks);
  
  // Extract all milestones for the overview
  const allMilestones = weeks.flatMap((week: TimelineWeekType) => week.milestones);
  
  if (weeks.length === 0) {
    return (
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
        <div className="flex">
          <div className="flex-shrink-0">
            <span className="text-yellow-400 text-lg">⚠️</span>
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-yellow-800">
              Información incompleta
            </h3>
            <div className="mt-2 text-sm text-yellow-700">
              <p>
                Para generar la línea de tiempo necesitamos al menos la fecha de entrega 
                de llaves del origen y algunas tareas generadas.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Milestones Overview */}
      <TimelineMilestones milestones={allMilestones} />
      
      {/* Weekly Timeline */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">
            📅 Planificación semanal
          </h3>
          <p className="text-sm text-gray-500">
            Tareas organizadas por semana desde el inicio hasta la entrega de llaves
          </p>
        </div>
        <div className="divide-y divide-gray-200">
          {weeks.map((week: TimelineWeekType, index: number) => (
            <TimelineWeek 
              key={`week-${index}`}
              week={week}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
