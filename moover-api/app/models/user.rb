class User < ApplicationRecord
  has_secure_password
  has_many :moves, dependent: :destroy

  validates :email, presence: true, uniqueness: { case_sensitive: false }, format: { with: URI::MailTo::EMAIL_REGEXP }
  validates :password, length: { minimum: 6 }
  
  before_save :downcase_email
  
  # Helper method to get current active move
  def current_move
    moves.where.not(status: :completed).first
  end
  
  private
  
  def downcase_email
    self.email = email.downcase if email.present?
  end
end
