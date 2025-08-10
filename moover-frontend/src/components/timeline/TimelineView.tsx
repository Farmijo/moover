import { Move, UserTask } from '@/types/api';
import TimelineWeek from './TimelineWeek';
import TimelineMilestones from './TimelineMilestones';
import { generateTimelineWeeks } from './utils';
import { TimelineWeek as TimelineWeekType } from './utils';

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
      <div className="bg-gradient-to-r from-[#FCD34D]/10 to-[#FCD34D]/5 border border-[#FCD34D]/30 rounded-xl p-8">
        <div className="flex">
          <div className="flex-shrink-0">
            <span className="text-[#FCD34D] text-2xl">⚠️</span>
          </div>
          <div className="ml-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Información incompleta
            </h3>
            <div className="text-gray-700">
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
      <div className="bg-white rounded-xl shadow-lg border border-gray-100">
        <div className="px-8 py-6 border-b border-gray-100">
          <h3 className="text-lg font-semibold bg-gradient-to-r from-[#7C3AED] to-[#3B82F6] bg-clip-text text-transparent">
            📅 Planificación semanal
          </h3>
          <p className="text-sm text-gray-500 mt-1">
            Tareas organizadas por semana desde el inicio hasta la entrega de llaves
          </p>
        </div>
        <div className="divide-y divide-gray-100">
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
