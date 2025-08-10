import { Move, UserTask } from '@/types/api';

// Extended UserTask type for priority calculation
export type PriorityUserTask = UserTask & {
  priorityScore: number;
  urgencyReason: string;
  targetDate: Date | null;
  daysFromNow: number;
};

// Utility function to get days until a date
export const getDaysUntilDate = (date: string | null): number => {
  if (!date) return 999;
  const targetDate = new Date(date);
  const today = new Date();
  const diffTime = targetDate.getTime() - today.getTime();
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
};

// Format date for display
export const formatDate = (date: string | null): string => {
  if (!date) return '';
  return new Date(date).toLocaleDateString('es-ES', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });
};

// Get relative date text
export const getRelativeDate = (date: string | null): string => {
  if (!date) return '';
  const days = getDaysUntilDate(date);
  if (days < 0) return `Hace ${Math.abs(days)} días`;
  if (days === 0) return 'Hoy';
  if (days === 1) return 'Mañana';
  if (days <= 7) return `En ${days} días`;
  return `En ${days} días`;
};

// Calculate priority tasks based on move timeline
export const calculatePriorityTasks = (userTasks: UserTask[], move: Move): PriorityUserTask[] => {
  const now = new Date();
  const moveOutDate = move.origin_move_out_date ? new Date(move.origin_move_out_date) : null;
  const keyDeliveryDate = move.destination_key_delivery_date ? new Date(move.destination_key_delivery_date) : null;
  
  // Filter only incomplete tasks
  const incompleteTasks = userTasks.filter(task => !task.completed);
  
  // Calculate priority score for each task
  const tasksWithPriority = incompleteTasks.map(task => {
    let priorityScore = 0;
    let urgencyReason = '';
    
    // Base timing from task (negative means before move, positive means after)
    const taskTiming = task.task?.timing || 0;
    
    // Calculate target date for this task
    let targetDate: Date | null = null;
    if (moveOutDate) {
      // If timing is negative, it should be done before move out
      // If timing is positive, it should be done after key delivery (if available) or move out
      if (taskTiming <= 0) {
        targetDate = new Date(moveOutDate.getTime() + taskTiming * 24 * 60 * 60 * 1000);
      } else {
        const referenceDate = keyDeliveryDate || moveOutDate;
        targetDate = new Date(referenceDate.getTime() + taskTiming * 24 * 60 * 60 * 1000);
      }
    }
    
    if (targetDate) {
      const daysUntilTarget = Math.ceil((targetDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
      
      // Higher priority score means more urgent
      if (daysUntilTarget < 0) {
        // Overdue tasks get highest priority
        priorityScore = 1000 + Math.abs(daysUntilTarget);
        urgencyReason = `Vencida hace ${Math.abs(daysUntilTarget)} días`;
      } else if (daysUntilTarget <= 3) {
        // Tasks due in next 3 days get high priority
        priorityScore = 500 + (3 - daysUntilTarget) * 100;
        urgencyReason = `Vence en ${daysUntilTarget} ${daysUntilTarget === 1 ? 'día' : 'días'}`;
      } else if (daysUntilTarget <= 7) {
        // Tasks due in next week get medium priority
        priorityScore = 300 + (7 - daysUntilTarget) * 10;
        urgencyReason = `Vence en ${daysUntilTarget} días`;
      } else {
        // Future tasks get lower priority, but earlier timing gets higher priority
        priorityScore = Math.max(1, 100 - daysUntilTarget);
        urgencyReason = `Planificar para dentro de ${daysUntilTarget} días`;
      }
    } else {
      // Tasks without clear timeline get medium priority
      priorityScore = 50;
      urgencyReason = 'Sin fecha específica';
    }
    
    return {
      ...task,
      priorityScore,
      urgencyReason,
      targetDate,
      daysFromNow: targetDate ? Math.ceil((targetDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)) : 999
    };
  });
  
  // Sort by priority score (highest first) and return top 3
  return tasksWithPriority
    .sort((a, b) => b.priorityScore - a.priorityScore)
    .slice(0, 3);
};

// Check if tasks can be generated (requires origin key delivery date)
export const canGenerateTasks = (move: Move | null): boolean => {
  if (!move) return false;
  return !!move.origin_key_delivery_date;
};
