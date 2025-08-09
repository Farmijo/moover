require 'rails_helper_minimal'

RSpec.describe 'Minimal test' do
  it 'works' do
    expect(1 + 1).to eq(2)
  end
  
  it 'can create a user directly' do
    user = User.create!(email: 'test@example.com', password: 'password123')
    expect(user).to be_persisted
    expect(user.email).to eq('test@example.com')
  end
end
