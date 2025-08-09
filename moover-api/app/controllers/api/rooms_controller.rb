class Api::RoomsController < Api::ProtectedController
  before_action :set_move
  before_action :set_room, only: [:show, :update, :destroy]

  # GET /api/moves/:move_id/rooms
  def index
    @rooms = @move.rooms.includes(:user_tasks)
    render json: @rooms, each_serializer: RoomSerializer
  end

  # GET /api/moves/:move_id/rooms/1
  def show
    render json: @room, serializer: RoomSerializer
  end

  # POST /api/moves/:move_id/rooms
  def create
    @room = @move.rooms.build(room_params)
    
    if @room.save
      # Generar tareas automáticamente después de crear la habitación
      @move.generate_user_tasks! if params[:generate_tasks] == true
      
      render json: @room, serializer: RoomSerializer, status: :created
    else
      render json: { errors: @room.errors }, status: :unprocessable_entity
    end
  end

  # PATCH/PUT /api/moves/:move_id/rooms/1
  def update
    if @room.update(room_params)
      render json: @room, serializer: RoomSerializer
    else
      render json: { errors: @room.errors }, status: :unprocessable_entity
    end
  end

  # DELETE /api/moves/:move_id/rooms/1
  def destroy
    @room.destroy
    head :no_content
  end

  # GET /api/moves/:move_id/rooms/room_types
  def room_types
    room_types_with_display = Room.room_types.keys.map do |room_type|
      {
        value: room_type,
        display: case room_type
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
                else room_type.humanize
                end
      }
    end
    
    render json: { room_types: room_types_with_display }
  end

  private

  def set_move
    @move = current_user.moves.find(params[:move_id])
  end

  def set_room
    @room = @move.rooms.find(params[:id])
  end

  def room_params
    params.require(:room).permit(:name, :room_type)
  end
end
