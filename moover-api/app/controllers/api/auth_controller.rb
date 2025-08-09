require 'jwt'

module Api
  class AuthController < ApplicationController

    def signup
      puts "Received signup request with params: #{params.inspect}"
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
      user = User.find_by(email: params[:email])
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
