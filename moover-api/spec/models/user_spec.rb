require 'rails_helper'

RSpec.describe User, type: :model do
  describe 'validations' do
    subject { build(:user) }

    it { should validate_presence_of(:email) }
    it { should validate_presence_of(:password) }
    
    it { should validate_uniqueness_of(:email).case_insensitive }
    it { should validate_length_of(:password).is_at_least(6) }
    
    it { should allow_value('user@example.com').for(:email) }
    it { should_not allow_value('invalid_email').for(:email) }
  end

  describe 'associations' do
    it { should have_many(:moves).dependent(:destroy) }
  end

  describe 'secure password' do
    it 'should have secure password' do
      expect(subject).to respond_to(:authenticate)
    end

    it 'should authenticate with correct password' do
      user = create(:user, password: 'password123')
      expect(user.authenticate('password123')).to eq(user)
    end

    it 'should not authenticate with wrong password' do
      user = create(:user, password: 'password123')
      expect(user.authenticate('wrongpassword')).to be_falsey
    end
  end

  describe 'factory' do
    it 'creates a valid user' do
      user = build(:user)
      expect(user).to be_valid
    end

    it 'generates unique emails' do
      user1 = create(:user)
      user2 = create(:user)
      expect(user1.email).not_to eq(user2.email)
    end
  end

  describe 'callbacks and methods' do
    it 'downcases email before saving' do
      user = create(:user, email: 'USER@EXAMPLE.COM')
      expect(user.email).to eq('user@example.com')
    end
    
    it 'responds to current_move method' do
      user = build(:user)
      expect(user).to respond_to(:current_move)
    end
  end
end
