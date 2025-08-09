require "test_helper"

class UserTest < ActiveSupport::TestCase
  test "should be valid with valid attributes" do
    user = User.new(
      email: "john@example.com",
      password: "password123"
    )
    assert user.valid?, "User should be valid with proper attributes"
  end

  test "should require email" do
    user = User.new(
      password: "password123"
    )
    assert_not user.valid?, "User should not be valid without email"
    assert_includes user.errors[:email], "can't be blank"
  end

  test "should require unique email" do
    user1 = User.create!(
      email: "john@example.com",
      password: "password123"
    )
    
    user2 = User.new(
      email: "john@example.com",
      password: "password123"
    )
    
    assert_not user2.valid?, "User should not be valid with duplicate email"
    assert_includes user2.errors[:email], "has already been taken"
  end

  test "should require password" do
    user = User.new(
      email: "john@example.com"
    )
    assert_not user.valid?, "User should not be valid without password"
    assert_includes user.errors[:password], "can't be blank"
  end

  test "should require password with minimum length" do
    user = User.new(
      email: "john@example.com",
      password: "12345"
    )
    assert_not user.valid?, "User should not be valid with short password"
    assert_includes user.errors[:password], "is too short (minimum is 6 characters)"
  end

  test "should validate email format" do
    user = User.new(
      email: "invalid_email",
      password: "password123"
    )
    assert_not user.valid?, "User should not be valid with invalid email format"
  end

  test "should authenticate with correct password" do
    user = User.create!(
      email: "john@example.com",
      password: "password123"
    )
    
    assert user.authenticate("password123"), "User should authenticate with correct password"
    assert_not user.authenticate("wrongpassword"), "User should not authenticate with wrong password"
  end

  test "should downcase email before saving" do
    user = User.create!(
      email: "JOHN@EXAMPLE.COM",
      password: "password123"
    )
    
    assert_equal "john@example.com", user.email, "Email should be downcased"
  end

  test "should have many moves" do
    assert_respond_to User.new, :moves, "User should have moves association"
  end
end
