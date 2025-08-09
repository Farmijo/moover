require 'rails_helper'

RSpec.describe 'API Authentication Debug', type: :request do
  let(:user) { create(:user) }
  
  it 'creates a user correctly' do
    expect(user).to be_valid
    expect(user.email).to be_present
  end
  
  it 'generates auth headers correctly' do
    headers = auth_headers_for(user)
    expect(headers).to have_key('Authorization')
    expect(headers['Authorization']).to start_with('Bearer ')
  end
  
  it 'can access profile endpoint with auth' do
    headers = auth_headers_for(user)
    get '/api/profile', headers: headers, as: :json
    
    puts "Response status: #{response.status}"
    puts "Response body: #{response.body}"
    
    expect(response.status).to eq(200)
  end
  
  it 'can access tasks endpoint with auth' do
    create(:task, name: 'Test Task', category: 'pack')
    
    headers = auth_headers_for(user)
    get '/api/tasks', headers: headers, as: :json
    
    puts "Tasks Response status: #{response.status}"
    puts "Tasks Response body: #{response.body}"
    puts "Tasks Response headers: #{response.headers}"
    
    expect(response.status).to eq(200)
  end
end
