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
end
