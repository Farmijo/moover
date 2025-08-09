require 'rails_helper'

RSpec.describe Move, type: :model do
  describe 'validations' do
    subject { build(:move) }

    it { should validate_presence_of(:origin_address) }
    it { should validate_presence_of(:destination_address) }
    it { should validate_presence_of(:move_type) }
    it { should validate_presence_of(:status) }
    # Key delivery dates are optional
  end

  describe 'associations' do
    it 'belongs to user' do
      move = build(:move)
      expect(move.user).to be_present
      expect(move).to respond_to(:user)
    end
    
    it { should have_many(:rooms).dependent(:destroy) }
    it { should have_many(:user_tasks).dependent(:destroy) }
  end

  describe 'enums' do
    it 'defines move_type enum' do
      expect(Move.move_types).to include('apartment', 'house', 'office', 'storage', 'other')
    end

    it 'defines status enum' do
      expect(Move.statuses).to include('planning', 'in_progress', 'completed')
    end
  end

  describe 'business logic' do
    let(:user) { create(:user) }
    
    it 'allows only one active move per user' do
      create(:move, :in_progress, user: user)

      second_move = build(:move, :in_progress, user: user)
      expect(second_move).not_to be_valid
      expect(second_move.errors[:base]).to include('Solo puedes tener una mudanza activa a la vez')
    end
    
    it 'allows multiple moves if previous is completed' do
      create(:move, :completed, user: user)
      
      second_move = build(:move, :planning, user: user)
      expect(second_move).to be_valid
    end
  end

  describe 'date validations' do
  it 'validates that destination_key_delivery_date is before origin_move_out_date' do
    move = build(:move, 
      origin_move_out_date: 1.day.from_now,
      destination_key_delivery_date: 2.days.from_now
    )
    expect(move).not_to be_valid
    expect(move.errors[:destination_key_delivery_date]).to include('debe ser anterior a la fecha de salida del origen')
  end


    it 'validates that dates are not in the past' do
      move = build(:move, origin_move_out_date: 1.day.ago)
      expect(move).not_to be_valid
      expect(move.errors[:origin_move_out_date]).to include('no puede ser una fecha pasada')
    end

  end

  describe 'factory' do
    it 'creates a valid move' do
      move = build(:move)
      expect(move).to be_valid
    end

    it 'creates moves with different traits' do
      apartment_move = create(:move, :apartment)
      house_move = create(:move, :house)
      
      expect(apartment_move.move_type).to eq('apartment')
      expect(house_move.move_type).to eq('house')
    end
  end
end
