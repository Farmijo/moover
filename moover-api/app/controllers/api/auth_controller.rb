require 'jwt'

module Api
  class AuthController < ApplicationController
    # Lista de emails permitidos para la beta privada
    ALLOWED_EMAILS = [
      'farmijo16@gmail.com'
    ].freeze

    def signup
      puts "Received signup request with params: #{params.inspect}"
      
      email = user_params[:email]&.strip&.downcase
      
      # Verificar si el email está en la lista de permitidos
      unless ALLOWED_EMAILS.include?(email)
        return render json: { 
          error: 'Esta aplicación está actualmente en beta privada. Solo usuarios con invitación pueden registrarse.' 
        }, status: :forbidden
      end
      
      user = User.new(user_params)
      puts "User params: #{user_params.inspect}"
      if user.save
        token = encode_token(user_id: user.id)
        render json: { user: user_data(user), token: token }, status: :created
      else
        render json: { errors: user.errors.full_messages }, status: :unprocessable_entity
      end
    end

    def login
      email = params[:email]&.strip&.downcase
      return render json: { error: 'Email o contraseña inválidos' }, status: :unauthorized if email.blank?
      
      user = User.find_by(email: email)
      if user&.authenticate(params[:password])
        token = encode_token(user_id: user.id)
        render json: { user: user_data(user), token: token }, status: :ok
      else
        render json: { error: 'Email o contraseña inválidos' }, status: :unauthorized
      end
    end

    private

    def user_data(user)
      { id: user.id, email: user.email }
    end

    def user_params
      params.require(:user).permit(:email, :password)
    end
  end
end
