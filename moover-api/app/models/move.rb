class Move < ApplicationRecord
  belongs_to :user
  
  # Enums
  enum move_type: { 
    apartment: 0, 
    house: 1, 
    office: 2, 
    storage: 3, 
    other: 4 
  }
  
  enum status: { 
    planning: 0, 
    in_progress: 1, 
    completed: 2 
  }
  
  # Validations
  validates :origin_address, presence: true
  validates :destination_address, presence: true
  validates :move_type, presence: true
  validates :status, presence: true
  
  # Ensure user can only have one active move at a time
  validate :only_one_active_move_per_user
  
  # Date validations
  validate :logical_date_order
  validate :dates_not_in_past, on: :create
  
  # Status transition validation
  validate :valid_status_transition
  
  # Prevent deletion if in progress
  before_destroy :prevent_deletion_if_in_progress
  
  private
  
  def only_one_active_move_per_user
    return if completed?
    
    existing_active_move = user.moves.where.not(status: :completed).where.not(id: id).first
    
    if existing_active_move
      errors.add(:base, 'Solo puedes tener una mudanza activa a la vez')
    end
  end
  
  def logical_date_order
    return unless origin_key_delivery_date && origin_move_out_date
    
    if origin_move_out_date > origin_key_delivery_date
      errors.add(:origin_move_out_date, 'no puede ser posterior a la fecha de entrega de llaves del origen')
    end
  end
  
  def dates_not_in_past
    today = Date.current
    
    # Validar fecha de salida del origen
    if origin_move_out_date && origin_move_out_date < today
      errors.add(:origin_move_out_date, 'no puede ser una fecha pasada')
    end
    
    # Validar fecha de entrega de llaves del origen
    if origin_key_delivery_date && origin_key_delivery_date < today
      errors.add(:origin_key_delivery_date, 'no puede ser una fecha pasada')
    end
    
    # Validar fecha de entrega de llaves del destino
    if destination_key_delivery_date && destination_key_delivery_date < today
      errors.add(:destination_key_delivery_date, 'no puede ser una fecha pasada')
    end
  end
  
  def valid_status_transition
    return unless status_changed? && persisted?
    
    old_status = status_was
    new_status = status
    
    # No se puede saltar de planning a completed directamente
    if old_status == 'planning' && new_status == 'completed'
      errors.add(:status, 'no puede cambiar directamente de "planificando" a "completada"')
    end
    
    # No se puede regresar de completed a otros estados
    if old_status == 'completed'
      errors.add(:status, 'no se puede cambiar el estado de una mudanza completada')
    end
  end
  
  def prevent_deletion_if_in_progress
    if in_progress?
      errors.add(:base, 'No se puede eliminar una mudanza en progreso')
      throw(:abort)
    end
  end
end
