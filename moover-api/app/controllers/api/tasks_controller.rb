class Api::TasksController < Api::ProtectedController
  before_action :set_task, only: [:show]

  # GET /api/tasks
  def index
    @tasks = Task.all
    
    # Filtros opcionales
    @tasks = @tasks.by_category(params[:category]) if params[:category].present?
    
    if params[:room_specific].present?
      if params[:room_specific] == 'true'
        @tasks = @tasks.room_specific
      elsif params[:room_specific] == 'false'
        @tasks = @tasks.general
      end
    end
    
    if params[:timing_before].present?
      @tasks = @tasks.where('timing < ?', params[:timing_before].to_i)
    end
    
    if params[:timing_after].present?
      @tasks = @tasks.where('timing > ?', params[:timing_after].to_i)
    end
    
    render json: @tasks, each_serializer: TaskSerializer
  end

  # GET /api/tasks/1
  def show
    render json: @task, serializer: TaskSerializer
  end

  # GET /api/tasks/categories
  def categories
    categories_with_display = Task::CATEGORIES.map do |category|
      {
        value: category,
        display: case category
                when 'pack' then 'Embalaje'
                when 'clean' then 'Limpieza'
                when 'admin' then 'Administrativa'
                when 'logistics' then 'Logística'
                when 'preparation' then 'Preparación'
                when 'moving_day' then 'Día de mudanza'
                when 'general' then 'General'
                else category.humanize
                end
      }
    end
    
    render json: { categories: categories_with_display }
  end

  private

  def set_task
    @task = Task.find(params[:id])
  end
end
