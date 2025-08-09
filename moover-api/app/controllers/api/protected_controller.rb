# app/controllers/api/protected_controller.rb
module Api
  class ProtectedController < ApplicationController
    before_action :authenticate_request!

    def profile
      render json: { email: current_user.email, id: current_user.id }
    end
  end
end
