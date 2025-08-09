require 'rails_helper'

RSpec.describe 'Simple Tasks Test', type: :request do
  it 'creates tasks and accesses endpoint step by step' do
    # Step 1: Create user and auth
    user = create(:user)
    headers = auth_headers_for(user)
    puts "✓ User created: #{user.email}"
    
    # Step 2: Create tasks using the same approach as the original test
    pack_task = create(:task, :pack)
    clean_task = create(:task, :clean)
    puts "✓ Tasks created: #{pack_task.name}, #{clean_task.name}"
    
    # Step 3: Verify tasks exist in database
    puts "✓ Total tasks in DB: #{Task.count}"
    Task.all.each do |task|
      puts "  - #{task.name} (#{task.category})"
    end
    
    # Step 4: Test the endpoint
    puts "\n--- Testing GET /api/tasks ---"
    get '/api/tasks', headers: headers, as: :json
    
    puts "Response status: #{response.status}"
    puts "Response body: #{response.body}"
    
    if response.status == 200
      puts "✓ SUCCESS: Endpoint working correctly"
    else
      puts "✗ FAILED: Expected 200, got #{response.status}"
    end
  end
end
