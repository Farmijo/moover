class ApplicationController < ActionController::API
  # Priority order: ENV variable > Rails credentials > secret_key_base fallback
  SECRET_KEY = ENV['JWT_SECRET_KEY'] || 
               Rails.application.credentials.jwt&.dig(:secret_key) || 
               Rails.application.secret_key_base

  def authenticate_request!
    render json: { error: 'No autorizado' }, status: :unauthorized unless current_user
  end

  def current_user
    return @current_user if @current_user

    auth_header = request.headers['Authorization']
    token = auth_header.split(' ').last if auth_header

    begin
      decoded = JWT.decode(token, SECRET_KEY)[0]
      @current_user = User.find_by(id: decoded['user_id'])
    rescue JWT::DecodeError
      nil
    end
  end
end
