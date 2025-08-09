class Move < ApplicationRecord
  belongs_to :user
  has_many :rooms, dependent: :destroy
  has_many :user_tasks, dependent: :destroy
  
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
  validate :destination_key_delivered_before_moving, on: :create

  # Status transition validation
  validate :valid_status_transition
  
  # Prevent deletion if in progress
  before_destroy :prevent_deletion_if_in_progress
  
  # Generate user tasks when rooms are configured
  def generate_user_tasks!
    # Clear existing user tasks
    user_tasks.destroy_all
    
    # Generate tasks for each configured room
    rooms.each do |room|
      generate_room_specific_tasks(room)
    end
    
    # Generate general tasks (not room-specific)
    generate_general_tasks
    
    true
  end

  # Generate user tasks for a specific room
  def generate_user_tasks_for_room!(room)
    # Clear existing tasks for this room
    existing_count = user_tasks.where(room: room).count
    user_tasks.where(room: room).destroy_all
    
    # Generate room-specific tasks
    tasks_count = generate_room_specific_tasks(room)
    
    tasks_count
  end
  
  # Helper to get move out date for task timing calculations
  def reference_date
    origin_move_out_date || created_at.to_date
  end
  
  private
  
  def only_one_active_move_per_user
    return if completed?
    
    existing_active_move = user.moves.where.not(status: [:completed, :planning]).where.not(id: id).first
    
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

  def destination_key_delivered_before_moving
    return unless destination_key_delivery_date && origin_move_out_date

    if destination_key_delivery_date > origin_move_out_date
      errors.add(:destination_key_delivery_date, 'debe ser anterior a la fecha de salida del origen')
    end
  end

  def valid_status_transition
    return unless will_save_change_to_status? && persisted?

    old_status = status_before_last_save
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
  
  def generate_room_specific_tasks(room)
    tasks_count = 0
    Task.room_specific.each do |task|
      next unless task.applies_to_room_type?(room.room_type)
      
      create_user_task_from_template(task, room)
      tasks_count += 1
    end
    
    tasks_count
  end
  
  def generate_general_tasks
    Task.general.each do |task|
      create_user_task_from_template(task, nil)
    end
  end
  
  def create_user_task_from_template(task, room = nil)
    task_name = room ? task.generate_name_for_room(room.name) : task.name
    due_date = calculate_due_date(task.timing)
    
    user_tasks.create!(
      task: task,
      room: room,
      name: task_name,
      completed: false,
      due_date: due_date
    )
  end
  
  def calculate_due_date(timing)
    return nil if timing.nil?
    
    base_date = reference_date
    base_date + timing.days
  end
end
