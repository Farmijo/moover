require "test_helper"

class SimpleTest < ActiveSupport::TestCase
  test "basic math works" do
    assert_equal 2, 1 + 1
  end

  test "string equality" do
    assert_equal "hello", "hello"
  end
end
