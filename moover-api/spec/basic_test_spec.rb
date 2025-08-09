require 'rails_helper_simple'

RSpec.describe 'Basic test', type: :model do
  it 'should work' do
    expect(1 + 1).to eq(2)
  end

  it 'can create a user' do
    user = User.new(
      email: "test@example.com",
      password: "password123"
    )
    expect(user).to be_valid
  end
end
