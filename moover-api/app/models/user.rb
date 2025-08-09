class User < ApplicationRecord
  has_secure_password
  has_many :moves, dependent: :destroy

  validates :email, presence: true, uniqueness: true
  
  # Helper method to get current active move
  def current_move
    moves.where.not(status: :completed).first
  end
end
