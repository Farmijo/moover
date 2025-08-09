require 'rails_helper'

RSpec.describe UserTask, type: :model do
  describe 'validations' do
    subject { build(:user_task, name: 'Test Task') }

    it { should validate_presence_of(:name) }
    it { should validate_inclusion_of(:completed).in_array([true, false]) }
    # due_date is optional
  end

  describe 'associations' do
    it { should belong_to(:move) }
    it { should belong_to(:task) }
    it { should belong_to(:room).optional }
  end

  describe 'scopes' do
    let(:move) { create(:move) }
    let(:task) { create(:task) }
    let!(:completed_task) { create(:user_task, :completed, move: move, task: task, name: 'Completed Task') }
    let!(:pending_task) { create(:user_task, :pending, move: move, task: task, name: 'Pending Task') }
    let!(:overdue_task) { create(:user_task, move: move, task: task, name: 'Overdue Task', 
                                 completed: false, due_date: 3.days.ago) }

    describe '.completed' do
      it 'returns only completed tasks' do
        completed_tasks = UserTask.completed
        expect(completed_tasks).to include(completed_task)
        expect(completed_tasks).not_to include(pending_task)
      end
    end

    describe '.pending' do
      it 'returns only pending tasks' do
        pending_tasks = UserTask.pending
        expect(pending_tasks).to include(pending_task, overdue_task)
        expect(pending_tasks).not_to include(completed_task)
      end
    end

    describe '.overdue' do
      it 'returns only overdue tasks' do
        overdue_tasks = UserTask.overdue
        expect(overdue_tasks).to include(overdue_task)
        expect(overdue_tasks).not_to include(completed_task, pending_task)
      end
    end

    describe '.by_category' do
      it 'filters tasks by category' do
        pack_task = create(:task, category: 'pack')
        user_task = create(:user_task, task: pack_task, move: move, name: 'Pack task')
        
        category_tasks = UserTask.by_category('pack')
        expect(category_tasks).to include(user_task)
      end
    end
  end

  describe 'display methods' do
    describe '#days_until_due' do
      it 'calculates days correctly for future due dates' do
        task = build(:user_task, due_date: 5.days.from_now)
        expect(task.days_until_due).to eq(5)
      end

      it 'returns negative days for past due dates' do
        task = build(:user_task, due_date: 3.days.ago)
        expect(task.days_until_due).to eq(-3)
      end

      it 'returns 0 for today due date' do
        task = build(:user_task, due_date: Date.current)
        expect(task.days_until_due).to eq(0)
      end
    end

    describe '#overdue?' do
      it 'returns true for overdue pending tasks' do
        task = build(:user_task, completed: false, due_date: 3.days.ago)
        expect(task.overdue?).to be true
      end

      it 'returns false for completed tasks even if past due date' do
        task = build(:user_task, completed: true, due_date: 3.days.ago)
        expect(task.overdue?).to be false
      end

      it 'returns false for future due dates' do
        task = build(:user_task, completed: false, due_date: 5.days.from_now)
        expect(task.overdue?).to be false
      end
    end

    describe '#room_display_name' do
      it 'returns room display name when room is present' do
        room = create(:room, name: 'Kitchen')
        task = build(:user_task, room: room)
        expect(task.room_display_name).to eq(room.display_name)
      end

      it 'returns "General" when room is nil' do
        task = build(:user_task, room: nil)
        expect(task.room_display_name).to eq('General')
      end
    end

    describe '#category' do
      it 'returns task category' do
        task_model = create(:task, category: 'pack')
        user_task = build(:user_task, task: task_model)
        expect(user_task.category).to eq('pack')
      end
    end
  end

  describe 'factory' do
    it 'creates a valid user task' do
      user_task = build(:user_task, name: 'Test Task')
      expect(user_task).to be_valid
    end

    it 'creates user tasks with different traits' do
      completed_task = create(:user_task, :completed, name: 'Completed Task')
      pending_task = create(:user_task, :pending, name: 'Pending Task')
      
      expect(completed_task.completed).to be true
      expect(pending_task.completed).to be false
    end
  end

  describe 'business logic' do
    describe 'completion' do
      let(:move) { create(:move) }
      let(:task) { create(:task) }
      let(:user_task) { create(:user_task, :pending, move: move, task: task, name: 'Test Task') }

      it 'sets completed_at when marked as completed' do
        user_task.update!(completed: true)
        expect(user_task.completed_at).to be_present
      end

      it 'clears completed_at when marked as incomplete' do
        user_task.update!(completed: true)
        user_task.update!(completed: false)
        expect(user_task.completed_at).to be_nil
      end
    end

    describe 'room consistency' do
      let(:move) { create(:move) }
      let(:general_task) { create(:task, is_room_specific: false) }
      let(:room_task) { create(:task, is_room_specific: true) }

      it 'allows room to be nil for general tasks' do
        user_task = build(:user_task, move: move, task: general_task, room: nil, name: 'General Task')
        expect(user_task).to be_valid
      end

      it 'allows room to be present for room-specific tasks' do
        room = create(:room, move: move)
        user_task = build(:user_task, move: move, task: room_task, room: room, name: 'Room Task')
        expect(user_task).to be_valid
      end
    end
  end
end
