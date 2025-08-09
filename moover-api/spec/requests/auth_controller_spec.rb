require 'rails_helper'

RSpec.describe Api::AuthController, type: :request do
  describe 'POST /api/signup' do
    let(:valid_attributes) do
      {
        user: {
          email: 'john@example.com',
          password: 'password123'
        }
      }
    end

    context 'with valid parameters' do
      it 'creates a new user and returns JWT token' do
        expect {
          post '/api/signup', params: valid_attributes, as: :json
        }.to change(User, :count).by(1)

        expect_json_response(201)
        expect(json_response).to have_key('token')
        expect(json_response).to have_key('user')
        expect(json_response['user']['email']).to eq('john@example.com')
      end

      it 'returns valid JWT token' do
        post '/api/signup', params: valid_attributes, as: :json
        
        token = json_response['token']
        decoded_token = jwt_decode(token)
        
        expect(decoded_token['user_id']).to eq(User.last.id)
        expect(decoded_token['exp']).to be > Time.current.to_i
      end
    end

    context 'with invalid parameters' do
      it 'returns validation errors for missing email' do
        invalid_attributes = { user: { password: 'password123' } }
        
        post '/api/signup', params: invalid_attributes, as: :json
        
        expect_json_response(422)
        expect(json_response).to have_key('errors')
        expect(json_response['errors']).to be_an(Array)
      end

      it 'returns validation errors for duplicate email' do
        create(:user, email: 'john@example.com')
        
        post '/api/signup', params: valid_attributes, as: :json
        
        expect_json_response(422)
        expect(json_response).to have_key('errors')
      end

      it 'returns validation errors for short password' do
        invalid_attributes = { user: { email: 'test@example.com', password: '123' } }
        
        post '/api/signup', params: invalid_attributes, as: :json
        
        expect_json_response(422)
        expect(json_response).to have_key('errors')
      end
    end
  end

  describe 'POST /api/login' do
    let!(:user) { create(:user, email: 'john@example.com', password: 'password123') }

    context 'with valid credentials' do
      it 'returns JWT token and user data' do
        post '/api/login', params: { 
          email: 'john@example.com', 
          password: 'password123' 
        }, as: :json

        expect_json_response(200)
        expect(json_response).to have_key('token')
        expect(json_response).to have_key('user')
        expect(json_response['user']['id']).to eq(user.id)
      end

      it 'returns valid JWT token' do
        post '/api/login', params: { 
          email: 'john@example.com', 
          password: 'password123' 
        }, as: :json
        
        token = json_response['token']
        decoded_token = jwt_decode(token)
        
        expect(decoded_token['user_id']).to eq(user.id)
        expect(decoded_token['exp']).to be > Time.current.to_i
      end

      it 'is case insensitive for email' do
        post '/api/login', params: { 
          email: 'JOHN@EXAMPLE.COM', 
          password: 'password123' 
        }, as: :json

        expect_json_response(200)
        expect(json_response).to have_key('token')
      end
    end

    context 'with invalid credentials' do
      it 'returns unauthorized for wrong password' do
        post '/api/login', params: { 
          email: 'john@example.com', 
          password: 'wrongpassword' 
        }, as: :json

        expect_json_response(401)
        expect(json_response).to have_key('error')
        expect(json_response['error']).to eq('Email o contraseña inválidos')
      end

      it 'returns unauthorized for wrong email' do
        post '/api/login', params: { 
          email: 'wrong@example.com', 
          password: 'password123' 
        }, as: :json

        expect_json_response(401)
        expect(json_response).to have_key('error')
      end

      it 'returns unauthorized for missing email' do
        post '/api/login', params: { password: 'password123' }, as: :json

        expect_json_response(401)
        expect(json_response).to have_key('error')
      end

      it 'returns unauthorized for missing password' do
        post '/api/login', params: { email: 'john@example.com' }, as: :json

        expect_json_response(401)
        expect(json_response).to have_key('error')
      end
    end
  end

  # Remove logout and me tests as they don't exist in the controller
end
