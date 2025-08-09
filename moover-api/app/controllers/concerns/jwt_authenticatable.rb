module JwtAuthenticatable
  extend ActiveSupport::Concern

  included do
    # Priority order: ENV variable > Rails credentials > secret_key_base fallback
    JWT_SECRET_KEY = ENV['JWT_SECRET_KEY'] || 
                     Rails.application.credentials.jwt&.dig(:secret_key) || 
                     Rails.application.secret_key_base
  end

  def authenticate_request!
    unless current_user
      error_message = if jwt_expired?
                       'Token expirado. Por favor, inicia sesión nuevamente.'
                     else
                       'No autorizado'
                     end
      render json: { error: error_message }, status: :unauthorized
    end
  end

  def current_user
    return @current_user if @current_user

    decoded_token = decode_jwt_token
    @current_user = User.find_by(id: decoded_token['user_id']) if decoded_token
  end

  def encode_token(payload)
    # Add expiration time (24 hours from now)
    payload[:exp] = 24.hours.from_now.to_i
    JWT.encode(payload, JWT_SECRET_KEY)
  end

  private

  def jwt_expired?
    return false unless jwt_token

    begin
      JWT.decode(jwt_token, JWT_SECRET_KEY)
      false
    rescue JWT::ExpiredSignature
      true
    rescue JWT::DecodeError
      false
    end
  end

  def jwt_token
    @jwt_token ||= begin
      auth_header = request.headers['Authorization']
      auth_header.split(' ').last if auth_header&.start_with?('Bearer ')
    end
  end

  def decode_jwt_token
    return nil unless jwt_token

    begin
      JWT.decode(jwt_token, JWT_SECRET_KEY)[0]
    rescue JWT::DecodeError => e
      Rails.logger.warn "JWT DecodeError: #{e.message}"
      nil
    rescue JWT::ExpiredSignature => e
      Rails.logger.warn "JWT ExpiredSignature: #{e.message}"
      nil
    end
  end
end
