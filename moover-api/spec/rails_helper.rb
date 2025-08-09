# This file is copied to spec/ when you run 'rails generate rspec:install'
require 'spec_helper'
ENV['RAILS_ENV'] ||= 'test'
ENV['JWT_SECRET_KEY'] ||= 'test_jwt_secret_key_for_rspec_testing'
require_relative '../config/environment'
# Prevent database truncation if the environment is production
abort("The Rails environment is running in production mode!") if Rails.env.production?
require 'rspec/rails'
# Add additional requires below this line. Rails is not loaded until this point!

require 'factory_bot_rails'
require 'faker'
require 'database_cleaner/active_record'
require 'shoulda/matchers'
require 'webmock/rspec'

# Requires supporting ruby files with custom matchers and macros, etc, in
# spec/support/ and its subdirectories. Files matching `spec/**/*_spec.rb` are
# run as spec files by default. This means that files in spec/support that end
# in _spec.rb will both be required and run as specs, causing the specs to be
# run twice. It is recommended that you do not name files matching this glob to
# end with _spec.rb. You can configure this pattern with the --pattern
# option on the command line or in ~/.rspec, .rspec or `.rspec-local`.
#
# The following line is provided for convenience purposes. It has the downside
# of increasing the boot-up time by auto-requiring all files in the support
# directory. Alternatively, in the individual `*_spec.rb` files, manually
# require only the support files necessary.
#
Dir[Rails.root.join('spec', 'support', '**', '*.rb')].sort.each { |f| require f }

# Checks for pending migrations and applies them before tests are run.
# If you are not using ActiveRecord, you can remove these lines.
begin
  ActiveRecord::Migration.maintain_test_schema!
rescue ActiveRecord::PendingMigrationError => e
  abort e.to_s.strip
end

RSpec.configure do |config|
  # Remove this line if you're not using ActiveRecord or ActiveRecord fixtures
  config.fixture_paths = [
    Rails.root.join('spec/fixtures')
  ]

  # If you're not using ActiveRecord, or you'd prefer not to run each of your
  # examples within a transaction, remove the following line or assign false
  # instead of true.
  config.use_transactional_fixtures = false

  # You can uncomment this line to turn off ActiveRecord support entirely.
  # config.use_active_record = false

  # RSpec Rails can automatically mix in different behaviours to your tests
  # based on their file location, for example enabling you to call `get` and
  # `post` in specs under `spec/controllers`.
  #
  # You can disable this behaviour by removing the line below, and instead
  # explicitly tag your specs with their type, e.g.:
  #
  #     RSpec.describe UsersController, type: :controller do
  #       # ...
  #     end
  #
  # The different available types are documented in the features, such as in
  # https://relishapp.com/rspec/rspec-rails/docs
  config.infer_spec_type_from_file_location!

  # Filter lines from Rails gems in backtraces.
  config.filter_rails_from_backtrace!
  # arbitrary gems may also be filtered via:
  # config.filter_gems_from_backtrace("gem name")

  # FactoryBot configuration
  config.include FactoryBot::Syntax::Methods

  # Database cleaner configuration
  config.before(:suite) do
    DatabaseCleaner.clean_with(:truncation)
    # Cargar seeds después de limpiar la base de datos
    Rails.application.load_seed
  end

  config.before(:each) do
    DatabaseCleaner.strategy = :transaction
    DatabaseCleaner.start
  end

  config.after(:each) do
    DatabaseCleaner.clean
    # Recargar tareas semilla después de cada test si no existen
    # if Task.count == 0
    #   Rails.application.load_seed
    # end
  end

  # Shoulda Matchers configuration
  Shoulda::Matchers.configure do |config|
    config.integrate do |with|
      with.test_framework :rspec
      with.library :rails
    end
  end

  # JWT helpers
  config.include Module.new {
    def jwt_encode(payload)
      JWT.encode(payload, ENV['JWT_SECRET_KEY'])
    end

    def jwt_decode(token)
      JWT.decode(token, ENV['JWT_SECRET_KEY']).first
    end

    def auth_headers_for(user)
      token = jwt_encode(user_id: user.id, exp: 24.hours.from_now.to_i)
      { 'Authorization' => "Bearer #{token}" }
    end
  }

  # Request helpers for API testing
  config.include Module.new {
    def json_response
      JSON.parse(response.body)
    end

    def expect_json_response(expected_status = 200)
      expect(response).to have_http_status(expected_status)
      expect(response.content_type).to match(%r{application/json})
    end
  }

  # WebMock configuration
  WebMock.disable_net_connect!(allow_localhost: true)
end
