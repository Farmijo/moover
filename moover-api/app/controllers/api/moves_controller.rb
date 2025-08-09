class Api::MovesController < ApplicationController
  before_action :authenticate_request!
  before_action :set_move, only: [:show, :update, :destroy, :generate_tasks]

  # GET /api/moves/current - Get user's current active move
  def current
    current_move = current_user.current_move
    
    if current_move
      render json: { move: MoveSerializer.new(current_move) }
    else
      render json: { 
        move: nil,
        message: 'No tienes ninguna mudanza activa'
      }
    end
  end

  # GET /api/moves
  def index
    @moves = current_user.moves.order(created_at: :desc)
    render json: {
      moves: ActiveModel::Serializer::CollectionSerializer.new(@moves, serializer: MoveSerializer),
      meta: {
        total_count: @moves.count,
        active_moves: @moves.where.not(status: :completed).count
      }
    }
  end

  # GET /api/moves/:id
  def show
    render json: { move: MoveSerializer.new(@move) }
  end

  # POST /api/moves/:id/generate_tasks - Generate user tasks based on rooms and templates
  def generate_tasks
    puts "Endpoint triggered"
    if @move.generate_user_tasks!
      render json: { 
        message: 'Tareas generadas exitosamente',
        tasks_count: @move.user_tasks.count
      }, status: :ok
    else
      render json: { 
        message: 'Error al generar tareas'
      }, status: :unprocessable_entity
    end
  end

  # POST /api/moves
  def create
    @move = current_user.moves.build(move_params)
    
    if @move.save
      render json: { 
        move: MoveSerializer.new(@move),
        message: 'Mudanza creada exitosamente'
      }, status: :created
    else
      render json: { 
        errors: @move.errors.full_messages,
        message: 'Error al crear la mudanza'
      }, status: :unprocessable_entity
    end
  end

  # PUT /api/moves/:id
  def update
    if @move.update(move_params)
      render json: { 
        move: MoveSerializer.new(@move),
        message: 'Mudanza actualizada exitosamente'
      }
    else
      render json: { 
        errors: @move.errors.full_messages,
        message: 'Error al actualizar la mudanza'
      }, status: :unprocessable_entity
    end
  end

  # DELETE /api/moves/:id
  def destroy
    if @move.destroy
      render json: { 
        message: 'Mudanza eliminada exitosamente' 
      }, status: :ok
    else
      render json: { 
        errors: @move.errors.full_messages,
        message: 'Error al eliminar la mudanza'
      }, status: :unprocessable_entity
    end
  end

  private

  def set_move
    @move = current_user.moves.find(params[:id])
  rescue ActiveRecord::RecordNotFound
    render json: { error: 'Mudanza no encontrada' }, status: :not_found
  end

  def move_params
    params.require(:move).permit(
      :origin_address,
      :destination_address,
      :move_type,
      :origin_key_delivery_date,
      :origin_move_out_date,
      :destination_key_delivery_date,
      :status
    )
  end
end
