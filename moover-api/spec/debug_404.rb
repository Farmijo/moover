require 'rails_helper'

RSpec.describe 'Debug 404 Issue', type: :request do
  it 'debugs the exact 404 issue' do
    # Create user and get auth token
    user = create(:user)
    headers = auth_headers_for(user)
    
    puts "\n=== DEBUG INFO ==="
    puts "User created: #{user.email}"
    puts "Auth headers: #{headers}"
    
    # Create a task
    task = create(:task, name: 'Debug Task', category: 'pack')
    puts "Task created: #{task.name} (ID: #{task.id})"
    puts "Total tasks in DB: #{Task.count}"
    
    # Test the exact request that's failing
    puts "\n=== MAKING REQUEST ==="
    puts "GET /api/tasks"
    
    get '/api/tasks', headers: headers, as: :json
    
    puts "\n=== RESPONSE DEBUG ==="
    puts "Status: #{response.status}"
    puts "Headers: #{response.headers.to_hash}"
    puts "Body: #{response.body}"
    puts "Content-Type: #{response.content_type}"
    
    # Let's also try without auth to see what error we get
    puts "\n=== WITHOUT AUTH ==="
    get '/api/tasks', as: :json
    puts "Status without auth: #{response.status}"
    puts "Body without auth: #{response.body}"
    
    # Test other endpoints for comparison
    puts "\n=== OTHER ENDPOINTS ==="
    get '/api/profile', headers: headers, as: :json
    puts "Profile endpoint status: #{response.status}"
    
    # Let's also check if the controller exists
    puts "\n=== CONTROLLER CHECK ==="
    puts "TasksController exists: #{defined?(Api::TasksController)}"
    puts "ProtectedController exists: #{defined?(Api::ProtectedController)}"
  end
end
