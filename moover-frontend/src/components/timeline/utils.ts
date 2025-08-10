import { Move, UserTask } from '../../types/api';

export interface TimelineWeek {
  weekNumber: number;
  startDate: Date;
  endDate: Date;
  isCurrentWeek: boolean;
  tasks: TimelineTask[];
  milestones: TimelineMilestone[];
}

export interface TimelineTask {
  id: number;
  name: string;
  completed: boolean;
  dueDate: Date | null;
  priority: 'high' | 'medium' | 'low';
  category: string;
  room?: string;
}

export interface TimelineMilestone {
  date: Date;
  title: string;
  description: string;
  type: 'origin_key' | 'move_out' | 'destination_key';
}

export const generateTimelineWeeks = (move: Move, userTasks: UserTask[]): TimelineWeek[] => {
  // Determine start and end dates for timeline
  const startDate = new Date(move.created_at);
  
  // Find the latest date among key dates
  const dates = [
    move.origin_key_delivery_date,
    move.origin_move_out_date,
    move.destination_key_delivery_date
  ].filter(Boolean).map(date => new Date(date!));
  
  if (dates.length === 0) {
    return [];
  }
  
  const endDate = new Date(Math.max(...dates.map(d => d.getTime())));
  
  // Generate weeks
  const weeks: TimelineWeek[] = [];
  const currentDate = new Date();
  
  // Start from the Monday of the week containing the start date
  const weekStart = getStartOfWeek(startDate);
  const currentWeekStart = new Date(weekStart);
  let weekNumber = 1;
  
  while (currentWeekStart <= endDate) {
    const weekEnd = new Date(currentWeekStart);
    weekEnd.setDate(weekEnd.getDate() + 6); // Sunday
    
    const isCurrentWeek = currentDate >= currentWeekStart && currentDate <= weekEnd;
    
    // Get tasks for this week
    const weekTasks = getTasksForWeek(userTasks, currentWeekStart, weekEnd, move);
    
    // Get milestones for this week
    const weekMilestones = getMilestonesForWeek(move, currentWeekStart, weekEnd);
    
    weeks.push({
      weekNumber,
      startDate: new Date(currentWeekStart),
      endDate: new Date(weekEnd),
      isCurrentWeek,
      tasks: weekTasks,
      milestones: weekMilestones
    });
    
    // Move to next week
    currentWeekStart.setDate(currentWeekStart.getDate() + 7);
    weekNumber++;
  }
  
  return weeks;
};

const getStartOfWeek = (date: Date): Date => {
  const d = new Date(date);
  const day = d.getDay();
  const diff = d.getDate() - day + (day === 0 ? -6 : 1); // Adjust for Monday start
  const result = new Date(d);
  result.setDate(diff);
  return result;
};

const getTasksForWeek = (
  userTasks: UserTask[], 
  weekStart: Date, 
  weekEnd: Date, 
  move: Move
): TimelineTask[] => {
  return userTasks
    .map(task => {
      const dueDate = calculateTaskDueDate(task, move);
      return {
        ...task,
        dueDate,
        priority: calculateTaskPriority(task, move, dueDate),
        category: task.task?.category || 'General',
        room: task.room?.name
      };
    })
    .filter(task => {
      if (!task.dueDate) return false;
      return task.dueDate >= weekStart && task.dueDate <= weekEnd;
    })
    .map(task => ({
      id: task.id,
      name: task.name,
      completed: task.completed,
      dueDate: task.dueDate,
      priority: task.priority,
      category: task.category,
      room: task.room
    }));
};

const calculateTaskDueDate = (task: UserTask, move: Move): Date | null => {
  if (!task.task?.timing || !move.origin_move_out_date) return null;
  
  const moveOutDate = new Date(move.origin_move_out_date);
  const timing = task.task.timing; // days relative to move out
  
  const dueDate = new Date(moveOutDate);
  dueDate.setDate(dueDate.getDate() + timing);
  
  return dueDate;
};

const calculateTaskPriority = (
  task: UserTask, 
  move: Move, 
  dueDate: Date | null
): 'high' | 'medium' | 'low' => {
  if (!dueDate) return 'low';
  
  const now = new Date();
  const daysUntilDue = Math.ceil((dueDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
  
  if (daysUntilDue < 0) return 'high'; // Overdue
  if (daysUntilDue <= 3) return 'high'; // Due in 3 days
  if (daysUntilDue <= 7) return 'medium'; // Due in a week
  
  return 'low';
};

const getMilestonesForWeek = (
  move: Move, 
  weekStart: Date, 
  weekEnd: Date
): TimelineMilestone[] => {
  const milestones: TimelineMilestone[] = [];
  
  // Check origin key delivery
  if (move.origin_key_delivery_date) {
    const keyDate = new Date(move.origin_key_delivery_date);
    if (keyDate >= weekStart && keyDate <= weekEnd) {
      milestones.push({
        date: keyDate,
        title: 'Entrega de llaves origen',
        description: 'Devolver las llaves del piso actual',
        type: 'origin_key'
      });
    }
  }
  
  // Check move out date
  if (move.origin_move_out_date) {
    const moveDate = new Date(move.origin_move_out_date);
    if (moveDate >= weekStart && moveDate <= weekEnd) {
      milestones.push({
        date: moveDate,
        title: 'Día de la mudanza',
        description: 'Salida del piso actual',
        type: 'move_out'
      });
    }
  }
  
  // Check destination key delivery
  if (move.destination_key_delivery_date) {
    const destKeyDate = new Date(move.destination_key_delivery_date);
    if (destKeyDate >= weekStart && destKeyDate <= weekEnd) {
      milestones.push({
        date: destKeyDate,
        title: 'Acceso nuevo hogar',
        description: 'Llaves del nuevo piso',
        type: 'destination_key'
      });
    }
  }
  
  return milestones.sort((a, b) => a.date.getTime() - b.date.getTime());
};

export const formatDate = (date: Date): string => {
  return date.toLocaleDateString('es-ES', {
    day: 'numeric',
    month: 'long'
  });
};

export const formatDateRange = (startDate: Date, endDate: Date): string => {
  const start = startDate.toLocaleDateString('es-ES', { day: 'numeric', month: 'short' });
  const end = endDate.toLocaleDateString('es-ES', { day: 'numeric', month: 'short' });
  
  return `${start} - ${end}`;
};
