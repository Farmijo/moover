require 'rails_helper'

RSpec.describe Api::TasksController, type: :request do
  let(:user) { create(:user) }
  let(:headers) { auth_headers_for(user) }

  describe 'GET /api/tasks' do
    let!(:pack_task) { create(:task, :pack) }
    let!(:clean_task) { create(:task, :clean) }
    let!(:room_specific_task) { create(:task, is_room_specific: true) }
    let!(:general_task) { create(:task, is_room_specific: false) }

    context 'with valid authentication' do
      it 'returns all tasks' do
        get '/api/tasks', headers: headers, as: :json

        expect_json_response(200)
        expect(json_response).to be_an(Array)
        expect(json_response.size).to eq(4)
      end

      it 'returns tasks with proper serialization' do
        get '/api/tasks', headers: headers, as: :json

        task_data = json_response.first
        expect(task_data).to have_key('id')
        expect(task_data).to have_key('name')
        expect(task_data).to have_key('category')
        expect(task_data).to have_key('category_display')
        expect(task_data).to have_key('timing_display')
      end

      context 'with category filter' do
        it 'filters tasks by category' do
          get '/api/tasks', params: { category: 'pack' }, headers: headers, as: :json

          expect_json_response(200)
          expect(json_response.size).to eq(1)
          expect(json_response.first['category']).to eq('pack')
        end

        it 'returns empty array for non-existent category' do
          get '/api/tasks', params: { category: 'nonexistent' }, headers: headers, as: :json

          expect_json_response(200)
          expect(json_response).to eq([])
        end
      end

      context 'with room_specific filter' do
        it 'filters room-specific tasks' do
          get '/api/tasks', params: { room_specific: 'true' }, headers: headers, as: :json

          expect_json_response(200)
          room_specific_tasks = json_response.select { |t| t['is_room_specific'] == true }
          expect(room_specific_tasks.size).to be >= 1
        end

        it 'filters general tasks' do
          get '/api/tasks', params: { room_specific: 'false' }, headers: headers, as: :json

          expect_json_response(200)
          general_tasks = json_response.select { |t| t['is_room_specific'] == false }
          expect(general_tasks.size).to be >= 1
        end
      end

      context 'with timing filters' do
        before do
          create(:task, timing: -7)  # 7 days before
          create(:task, timing: 3)   # 3 days after
        end

        it 'filters tasks by timing_before' do
          get '/api/tasks', params: { timing_before: 0 }, headers: headers, as: :json

          expect_json_response(200)
          before_tasks = json_response.select { |t| t['timing'] && t['timing'] < 0 }
          expect(before_tasks.size).to be >= 1
        end

        it 'filters tasks by timing_after' do
          get '/api/tasks', params: { timing_after: 0 }, headers: headers, as: :json

          expect_json_response(200)
          after_tasks = json_response.select { |t| t['timing'] && t['timing'] > 0 }
          expect(after_tasks.size).to be >= 1
        end
      end
    end

    context 'without authentication' do
      it 'returns unauthorized' do
        get '/api/tasks', as: :json

        expect_json_response(401)
        expect(json_response).to have_key('error')
      end
    end
  end

  describe 'GET /api/tasks/:id' do
    let(:task) { create(:task) }

    context 'with valid authentication and existing task' do
      it 'returns the specific task' do
        get "/api/tasks/#{task.id}", headers: headers, as: :json

        expect_json_response(200)
        expect(json_response['id']).to eq(task.id)
        expect(json_response['name']).to eq(task.name)
      end

      it 'returns task with full serialization' do
        get "/api/tasks/#{task.id}", headers: headers, as: :json

        expect(json_response).to have_key('category_display')
        expect(json_response).to have_key('timing_display')
      end
    end

    context 'with non-existent task' do
      it 'returns not found' do
        get '/api/tasks/999999', headers: headers, as: :json

        expect_json_response(404)
      end
    end

    context 'without authentication' do
      it 'returns unauthorized' do
        get "/api/tasks/#{task.id}", as: :json

        expect_json_response(401)
      end
    end
  end

  describe 'GET /api/tasks/categories' do
    context 'with valid authentication' do
      it 'returns all available categories' do
        get '/api/tasks/categories', headers: headers, as: :json

        expect_json_response(200)
        expect(json_response).to have_key('categories')
        expect(json_response['categories']).to be_an(Array)
      end

      it 'returns all expected categories' do
        get '/api/tasks/categories', headers: headers, as: :json

        categories = json_response['categories']
        expect(categories).to be_an(Array)
        expect(categories.size).to eq(Task::CATEGORIES.size)

        category_keys = categories.map { |c| c['value'] }
        expected_categories = %w[pack clean admin logistics preparation moving_day general]
        expect(category_keys).to match_array(expected_categories)
      end

      it 'returns categories with display names' do
        get '/api/tasks/categories', headers: headers, as: :json

        categories = json_response['categories']
        pack_category = categories.find { |c| c['value'] == 'pack' }
        expect(pack_category['display']).to eq('Embalaje')
      end
    end

    context 'without authentication' do
      it 'returns unauthorized' do
        get '/api/tasks/categories', as: :json

        expect_json_response(401)
      end
    end
  end

  describe 'filtering combinations' do
    before do
      create(:task, category: 'pack', is_room_specific: true)
      create(:task, category: 'pack', is_room_specific: false)
      create(:task, category: 'clean', is_room_specific: true)
    end

    it 'combines category and room_specific filters' do
      get '/api/tasks', params: { category: 'pack', room_specific: 'true' }, headers: headers, as: :json

      expect_json_response(200)
      expect(json_response.size).to eq(1)
      task = json_response.first
      expect(task['category']).to eq('pack')
      expect(task['is_room_specific']).to be true
    end

    it 'returns empty result for incompatible filters' do
      get '/api/tasks', params: { category: 'nonexistent', room_specific: 'true' }, headers: headers, as: :json

      expect_json_response(200)
      expect(json_response).to eq([])
    end
  end
end
