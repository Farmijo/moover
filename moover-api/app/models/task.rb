class Task < ApplicationRecord
  has_many :user_tasks, dependent: :destroy
  
  # Categorías válidas
  CATEGORIES = %w[pack clean admin logistics preparation moving_day general].freeze
  
  validates :name, presence: true
  validates :category, presence: true, inclusion: { in: CATEGORIES }
  
  # Serialize array of applicable room types
  serialize :applicable_room_types, coder: JSON
  
  # Scope para tareas por timing (días relativos)
  scope :for_timing, ->(days) { where(timing: days) }
  scope :room_specific, -> { where(is_room_specific: true) }
  scope :general, -> { where(is_room_specific: false) }
  scope :by_category, ->(category) { where(category: category) }
  
  # Scopes por categoría
  scope :pack, -> { where(category: 'pack') }
  scope :clean, -> { where(category: 'clean') }
  scope :admin, -> { where(category: 'admin') }
  scope :logistics, -> { where(category: 'logistics') }
  scope :preparation, -> { where(category: 'preparation') }
  scope :moving_day, -> { where(category: 'moving_day') }
  scope :general_category, -> { where(category: 'general') }
  
  # Check si aplica a un tipo de habitación
  def applies_to_room_type?(room_type)
    return true unless is_room_specific?
    return true if applicable_room_types.blank?
    
    applicable_room_types.include?(room_type.to_s)
  end
  
  # Generar nombre dinámico para habitación específica
  def generate_name_for_room(room_name)
    return name unless is_room_specific?
    
    name.gsub('{room_name}', room_name)
  end
  
  # Helper para timing display
  def timing_display
    return 'Sin timing específico' if timing.nil?
    return 'Día de mudanza' if timing.zero?
    
    if timing < 0
      "#{timing.abs} días antes"
    else
      "#{timing} días después"  
    end
  end
  
  # Helper para mostrar categoría en español
  def category_display
    case category
    when 'pack'
      'Embalaje'
    when 'clean'
      'Limpieza'
    when 'admin'
      'Administrativa'
    when 'logistics'
      'Logística'
    when 'preparation'
      'Preparación'
    when 'moving_day'
      'Día de mudanza'
    when 'general'
      'General'
    else
      category&.humanize || 'Sin categoría'
    end
  end

  # Helper para mostrar tipos de habitaciones aplicables
  def room_types_display
    return 'Todas las habitaciones' unless is_room_specific?
    return 'Todas las habitaciones' if applicable_room_types.blank?
    
    applicable_room_types.map do |room_type|
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

  # Helper para display de tipos de habitación
  def room_types_display
    return 'Todas las habitaciones' unless is_room_specific?
    return 'Todas las habitaciones' if applicable_room_types.blank?
    
    applicable_room_types.map do |room_type|
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
