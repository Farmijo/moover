class Api::UserTasksController < Api::ProtectedController
  before_action :set_move
  before_action :set_user_task, only: [:show, :update, :destroy]

  # GET /api/moves/:move_id/user_tasks
  def index
    @user_tasks = @move.user_tasks.includes(:task, :room)
    
    # Filtros opcionales
    @user_tasks = @user_tasks.where(completed: params[:completed]) if params[:completed].present?
    @user_tasks = @user_tasks.joins(:task).where(tasks: { category: params[:category] }) if params[:category].present?
    @user_tasks = @user_tasks.where(room_id: params[:room_id]) if params[:room_id].present?
    
    # Ordenamiento
    case params[:sort_by]
    when 'due_date'
      @user_tasks = @user_tasks.order(:due_date)
    when 'category'
      @user_tasks = @user_tasks.joins(:task).order('tasks.category')
    when 'completion'
      @user_tasks = @user_tasks.order(:completed, :due_date)
    else
      @user_tasks = @user_tasks.order(:due_date, :created_at)
    end
    
    render json: @user_tasks, each_serializer: UserTaskSerializer
  end

  # GET /api/moves/:move_id/user_tasks/1
  def show
    render json: @user_task, serializer: UserTaskSerializer
  end

  # PATCH/PUT /api/moves/:move_id/user_tasks/1
  def update
    if @user_task.update(user_task_params)
      # Recargar la mudanza para obtener el estado actualizado
      @move.reload
      
      render json: {
        user_task: UserTaskSerializer.new(@user_task),
        move_status: @move.status,
        move_completed: @move.completed?
      }
    else
      render json: { errors: @user_task.errors }, status: :unprocessable_entity
    end
  end

  # DELETE /api/moves/:move_id/user_tasks/1
  def destroy
    @user_task.destroy
    head :no_content
  end

  # PATCH /api/moves/:move_id/user_tasks/1/complete
  def complete
    @user_task = @move.user_tasks.find(params[:id])
    
    if @user_task.update(completed: true, completed_at: Time.current)
      render json: @user_task, serializer: UserTaskSerializer
    else
      render json: { errors: @user_task.errors }, status: :unprocessable_entity
    end
  end

  # PATCH /api/moves/:move_id/user_tasks/1/uncomplete
  def uncomplete
    @user_task = @move.user_tasks.find(params[:id])
    
    if @user_task.update(completed: false, completed_at: nil)
      render json: @user_task, serializer: UserTaskSerializer
    else
      render json: { errors: @user_task.errors }, status: :unprocessable_entity
    end
  end

  # GET /api/moves/:move_id/user_tasks/summary
  def summary
    total_tasks = @move.user_tasks.count
    completed_tasks = @move.user_tasks.completed.count
    pending_tasks = total_tasks - completed_tasks
    overdue_tasks = @move.user_tasks.joins(:task)
                         .where('user_tasks.due_date < ? AND user_tasks.completed = ?', Date.current, false)
                         .count
    
    progress_percentage = total_tasks > 0 ? ((completed_tasks.to_f / total_tasks) * 100).round(1) : 0
    
    # Tareas por categoría
    tasks_by_category = @move.user_tasks.joins(:task)
                             .group('tasks.category')
                             .group(:completed)
                             .count
    
    category_summary = {}
    Task::CATEGORIES.each do |category|
      completed = tasks_by_category[[category, true]] || 0
      pending = tasks_by_category[[category, false]] || 0
      total = completed + pending
      
      category_summary[category] = {
        total: total,
        completed: completed,
        pending: pending,
        percentage: total > 0 ? ((completed.to_f / total) * 100).round(1) : 0
      }
    end
    
    render json: {
      summary: {
        total_tasks: total_tasks,
        completed_tasks: completed_tasks,
        pending_tasks: pending_tasks,
        overdue_tasks: overdue_tasks,
        progress_percentage: progress_percentage
      },
      by_category: category_summary
    }
  end

  private

  def set_move
    @move = current_user.moves.find(params[:move_id])
  end

  def set_user_task
    @user_task = @move.user_tasks.find(params[:id])
  end

  def user_task_params
    params.require(:user_task).permit(:completed, :due_date)
  end
end
