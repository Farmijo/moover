class UserTask < ApplicationRecord
  belongs_to :move
  belongs_to :task
  belongs_to :room, optional: true  # Opcional para tareas generales
  
  validates :name, presence: true
  validates :completed, inclusion: { in: [true, false] }
  
  # Scopes útiles
  scope :completed, -> { where(completed: true) }
  scope :pending, -> { where(completed: false) }
  scope :overdue, -> { where(completed: false).where('due_date < ?', Date.current) }
  scope :due_soon, -> { where(completed: false).where(due_date: Date.current..7.days.from_now) }
  scope :by_category, ->(category) { joins(:task).where(tasks: { category: category }) }
  scope :for_room, ->(room) { where(room: room) }
  
  # Callback para marcar como completada
  before_save :set_completed_at, if: :completed_changed?
  
  # Callback para cambiar el estado de la mudanza cuando se complete la primera tarea
  after_save :update_move_status_if_first_task_completed, if: :saved_change_to_completed?
  
  # Helper methods
  def overdue?
    !completed? && due_date && due_date < Date.current
  end
  
  def due_soon?
    !completed? && due_date && due_date <= 7.days.from_now.to_date
  end
  
  def days_until_due
    return nil unless due_date
    (due_date - Date.current).to_i
  end
  
  def room_display_name
    room&.display_name || 'General'
  end
  
  def category
    task.category
  end
  
  private
  
  def set_completed_at
    if completed?
      self.completed_at = Time.current unless completed_at
    else
      self.completed_at = nil
    end
  end
  
  def update_move_status_if_first_task_completed
    if completed?
      # Tarea se acaba de completar
      # Solo cambiar si la mudanza está en estado de planificación
      if move.planning?
        move.update_column(:status, Move.statuses[:in_progress])
        Rails.logger.info "Mudanza ##{move.id} cambió a estado 'in_progress' al completar la primera tarea"
      end
    else
      # Tarea se acaba de desmarcar
      # Si no hay otras tareas completadas, regresar a planificación
      if move.in_progress? && move.user_tasks.completed.count == 0
        move.update_column(:status, Move.statuses[:planning])
        Rails.logger.info "Mudanza ##{move.id} regresó a estado 'planning' al no tener tareas completadas"
      end
    end
  end
end
