#!/usr/bin/env ruby

puts "Starting simple test..."

# Set environment
ENV['RAILS_ENV'] = 'test'

puts "Loading Rails..."
begin
  require_relative '../config/environment'
  puts "✓ Rails loaded successfully"
rescue => e
  puts "✗ Failed to load Rails: #{e.message}"
  exit 1
end

puts "Testing basic functionality..."

# Test 1: Basic math
result = 1 + 1
if result == 2
  puts "✓ Basic math works"
else
  puts "✗ Basic math failed"
  exit 1
end

# Test 2: User model
puts "Testing User model..."
begin
  user = User.new(
    name: "Test User",
    email: "test@example.com",
    phone: "+1234567890",
    password: "password123"
  )
  
  if user.valid?
    puts "✓ User model validation works"
  else
    puts "✗ User model validation failed: #{user.errors.full_messages.join(', ')}"
  end
rescue => e
  puts "✗ User model test failed: #{e.message}"
end

puts "All tests completed!"
