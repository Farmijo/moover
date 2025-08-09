class RoomSerializer < ActiveModel::Serializer
  attributes :id, :room_type, :name, :created_at, :updated_at
  
  # Add computed fields
  attribute :room_type_display
  attribute :tasks_count
  attribute :completed_tasks_count
  attribute :completion_percentage
  
  def room_type_display
    case object.room_type
    when 'bedroom' then 'Dormitorio'
    when 'kitchen' then 'Cocina'
    when 'bathroom' then 'Baño'
    when 'living_room' then 'Salón-comedor'
    when 'office' then 'Despacho'
    when 'storage_room' then 'Trastero'
    when 'terrace' then 'Terraza'
    when 'balcony' then 'Balcón'
    when 'garage' then 'Garaje'
    when 'basement' then 'Sótano'
    when 'attic' then 'Ático'
    when 'laundry_room' then 'Lavadero'
    when 'pantry' then 'Despensa'
    when 'entrance_hall' then 'Recibidor'
    when 'garden' then 'Jardín'
    when 'patio' then 'Patio'
    when 'pool_area' then 'Zona de piscina'
    when 'other' then 'Otro'
    else object.room_type.humanize
    end
  end
  
  def tasks_count
    object.user_tasks.count
  end
  
  def completed_tasks_count
    object.user_tasks.completed.count
  end
  
  def completion_percentage
    return 0 if tasks_count == 0
    ((completed_tasks_count.to_f / tasks_count) * 100).round(1)
  end
end
