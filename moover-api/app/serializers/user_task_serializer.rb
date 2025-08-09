class UserTaskSerializer < ActiveModel::Serializer
  attributes :id, :completed, :due_date, :completed_at, :name,
             :created_at, :updated_at, :room_id
  
  # Nested associations
  belongs_to :move
  belongs_to :task
  belongs_to :room, serializer: RoomSerializer
  
  # Add computed fields
  attribute :status_display
  attribute :days_until_due
  attribute :is_overdue
  
  def status_display
    if object.completed?
      'Completada'
    elsif object.due_date && object.due_date < Date.current
      'Atrasada'
    elsif object.due_date && object.due_date == Date.current
      'Vence hoy'
    elsif object.due_date && object.due_date <= Date.current + 3.days
      'Próxima a vencer'
    else
      'Pendiente'
    end
  end
  
  def days_until_due
    return nil unless object.due_date
    
    days = (object.due_date - Date.current).to_i
    
    if days < 0
      "Atrasada por #{days.abs} día#{'s' if days.abs != 1}"
    elsif days == 0
      'Vence hoy'
    elsif days == 1
      'Vence mañana'
    else
      "Vence en #{days} días"
    end
  end
  
  def is_overdue
    object.due_date && object.due_date < Date.current && !object.completed?
  end
end
