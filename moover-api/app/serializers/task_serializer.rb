class TaskSerializer < ActiveModel::Serializer
  attributes :id, :name, :description, :category, :is_room_specific, 
             :timing, :applicable_room_types, :created_at, :updated_at
  
  # Add human-readable fields
  attribute :category_display
  attribute :timing_display
  attribute :room_types_display
  
  def category_display
    object.category_display
  end
  
  def timing_display
    object.timing_display
  end
  
  def room_types_display
    return 'Todas las habitaciones' if object.applicable_room_types.blank?
    
    object.applicable_room_types.map do |room_type|
      case room_type
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
      else room_type.humanize
      end
    end.join(', ')
  end
end
