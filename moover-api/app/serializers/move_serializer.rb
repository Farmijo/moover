class MoveSerializer < ActiveModel::Serializer
  attributes :id, :origin_address, :destination_address, :move_type, :status,
             :origin_key_delivery_date, :origin_move_out_date, :destination_key_delivery_date,
             :created_at, :updated_at
  
  # Add human-readable status and move_type
  attribute :move_type_display
  attribute :status_display
  
  # Add useful computed fields
  attribute :is_active
  attribute :days_until_move_out
  
  def move_type_display
    object.move_type.humanize
  end
  
  def status_display
    case object.status
    when 'planning'
      'Planificando'
    when 'in_progress' 
      'En progreso'
    when 'completed'
      'Completada'
    end
  end
  
  def is_active
    !object.completed?
  end
  
  def days_until_move_out
    return nil unless object.origin_move_out_date
    
    days = (object.origin_move_out_date - Date.current).to_i
    days >= 0 ? days : 0
  end
end
