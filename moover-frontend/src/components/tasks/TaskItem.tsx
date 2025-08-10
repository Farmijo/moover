import { UserTask } from '@/types/api';

interface TaskItemProps {
  userTask: UserTask;
  onToggle: (taskId: number, completed: boolean) => void;
  moveOutDate?: string | null;
  keyDeliveryDate?: string | null;
}

// Calculate task priority and urgency
const calculateTaskPriority = (
  userTask: UserTask, 
  moveOutDate?: string | null,
  keyDeliveryDate?: string | null
) => {
  const now = new Date();
  
  // If task is completed, no priority styling needed
  if (userTask.completed) {
    return {
      priorityLevel: 'completed',
      urgencyText: '',
      daysFromNow: 0,
      backgroundColor: '',
      borderColor: '',
      textColor: ''
    };
  }
  
  // Calculate target date based on task timing and move dates
  let targetDate: Date | null = null;
  const taskTiming = userTask.task?.timing || 0;
  
  if (moveOutDate) {
    const moveOut = new Date(moveOutDate);
    if (taskTiming <= 0) {
      // Task should be done before move out
      targetDate = new Date(moveOut.getTime() + taskTiming * 24 * 60 * 60 * 1000);
    } else {
      // Task should be done after key delivery or move out
      const referenceDate = keyDeliveryDate ? new Date(keyDeliveryDate) : moveOut;
      targetDate = new Date(referenceDate.getTime() + taskTiming * 24 * 60 * 60 * 1000);
    }
  }
  
  if (targetDate) {
    const daysUntilTarget = Math.ceil((targetDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    
    if (daysUntilTarget < 0) {
      // Overdue - Red
      return {
        priorityLevel: 'overdue',
        urgencyText: `Vencida hace ${Math.abs(daysUntilTarget)} días`,
        daysFromNow: daysUntilTarget,
        backgroundColor: 'bg-red-50',
        borderColor: 'border-l-red-400',
        textColor: 'text-red-800'
      };
    } else if (daysUntilTarget <= 3) {
      // Due soon - Orange
      return {
        priorityLevel: 'urgent',
        urgencyText: `Vence en ${daysUntilTarget} ${daysUntilTarget === 1 ? 'día' : 'días'}`,
        daysFromNow: daysUntilTarget,
        backgroundColor: 'bg-orange-50',
        borderColor: 'border-l-orange-400',
        textColor: 'text-orange-800'
      };
    } else if (daysUntilTarget <= 7) {
      // Due in a week - Yellow
      return {
        priorityLevel: 'warning',
        urgencyText: `Vence en ${daysUntilTarget} días`,
        daysFromNow: daysUntilTarget,
        backgroundColor: 'bg-yellow-50',
        borderColor: 'border-l-yellow-400',
        textColor: 'text-yellow-800'
      };
    }
  }
  
  // Default - No special styling
  return {
    priorityLevel: 'normal',
    urgencyText: '',
    daysFromNow: 999,
    backgroundColor: '',
    borderColor: '',
    textColor: ''
  };
};

export default function TaskItem({ userTask, onToggle, moveOutDate, keyDeliveryDate }: TaskItemProps) {
  const priority = calculateTaskPriority(userTask, moveOutDate, keyDeliveryDate);
  
  return (
    <div className={`px-6 py-4 hover:bg-gray-50 ${priority.backgroundColor} ${priority.borderColor ? `border-l-4 ${priority.borderColor}` : ''}`}>
      <div className="flex items-start justify-between">
        <div className="flex items-start">
          <div className="flex items-center h-5">
            <input
              type="checkbox"
              checked={userTask.completed}
              onChange={(e) => onToggle(userTask.id, e.target.checked)}
              className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
            />
          </div>
          <div className="ml-3 text-sm">
            <div className="flex items-start justify-between">
              <p className={`font-medium ${
                userTask.completed ? 'line-through text-gray-500' : 'text-gray-900'
              }`}>
                {userTask.name}
              </p>
              {priority.urgencyText && (
                <span className={`ml-2 inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                  priority.priorityLevel === 'overdue' ? 'bg-red-100 text-red-800' :
                  priority.priorityLevel === 'urgent' ? 'bg-orange-100 text-orange-800' :
                  priority.priorityLevel === 'warning' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-gray-100 text-gray-800'
                }`}>
                  {priority.urgencyText}
                </span>
              )}
            </div>
            {userTask.task?.description && (
              <p className="text-gray-500 mt-1">
                {userTask.task.description}
              </p>
            )}
            <div className="flex items-center mt-2 space-x-4 text-xs text-gray-400">
              {userTask.room && (
                <span>🏠 {userTask.room.name}</span>
              )}
              {userTask.task?.category_display && (
                <span>📁 {userTask.task.category_display}</span>
              )}
              {userTask.due_date && (
                <span className={`${
                  !userTask.completed && new Date(userTask.due_date) < new Date()
                    ? 'text-red-500 font-medium'
                    : ''
                }`}>
                  📅 {new Date(userTask.due_date).toLocaleDateString('es-ES')}
                </span>
              )}
              {userTask.completed_at && (
                <span className="text-green-600">
                  ✅ {new Date(userTask.completed_at).toLocaleDateString('es-ES')}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
