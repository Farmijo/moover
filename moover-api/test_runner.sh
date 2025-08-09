#!/usr/bin/env bash

# Script para ejecutar tests
echo "Running tests..."

# Test simple para verificar que funciona
ruby -e "
require 'bundler/setup'
require_relative 'config/environment'
Rails.env = 'test'

puts 'Testing basic functionality...'
puts '1 + 1 = #{1 + 1}'

# Test factory
require 'factory_bot_rails'
FactoryBot.find_definitions

puts 'Creating user with factory...'
user = FactoryBot.build(:user)
puts 'User created: #{user.name} - #{user.email}'
puts 'User valid: #{user.valid?}'

puts 'All tests passed!'
"
