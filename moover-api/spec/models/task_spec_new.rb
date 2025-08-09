require 'rails_helper'

RSpec.describe Task, type: :model do
  describe 'validations' do
    subject { build(:task) }

    it { should validate_presence_of(:name) }
    it { should validate_presence_of(:category) }
    # description and timing are optional
    
    it { should validate_inclusion_of(:category).in_array(Task::CATEGORIES) }
  end

  describe 'associations' do
    it { should have_many(:user_tasks).dependent(:destroy) }
  end

  describe 'constants' do
    it 'defines CATEGORIES constant' do
      expected_categories = %w[pack clean admin logistics preparation moving_day general]
      expect(Task::CATEGORIES).to match_array(expected_categories)
    end
  end

  describe 'display methods' do
    describe '#category_display' do
      it 'returns localized category for pack' do
        task = build(:task, :pack)
        expect(task.category_display).to eq('Embalaje')
      end

      it 'returns localized category for clean' do
        task = build(:task, :clean)
        expect(task.category_display).to eq('Limpieza')
      end

      it 'returns localized category for admin' do
        task = build(:task, :admin)
        expect(task.category_display).to eq('Administrativa')
      end
    end

    describe '#timing_display' do
      it 'returns formatted timing for negative values' do
        task = build(:task, timing: -15)
        expect(task.timing_display).to eq('15 días antes')
      end

      it 'returns formatted timing for positive values' do
        task = build(:task, timing: 3)
        expect(task.timing_display).to eq('3 días después')
      end

      it 'returns formatted timing for zero' do
        task = build(:task, timing: 0)
        expect(task.timing_display).to eq('Día de mudanza')
      end
    end
  end

  describe 'scopes' do
    let!(:pack_task) { create(:task, :pack) }
    let!(:clean_task) { create(:task, :clean) }
    let!(:room_specific_task) { create(:task, is_room_specific: true) }
    let!(:general_task) { create(:task, is_room_specific: false) }

    describe 'category scopes' do
      it 'filters tasks by pack scope' do
        pack_tasks = Task.pack
        expect(pack_tasks).to include(pack_task)
        expect(pack_tasks).not_to include(clean_task)
      end
    end

    describe '.room_specific' do
      it 'returns only room specific tasks' do
        room_tasks = Task.room_specific
        expect(room_tasks).to include(room_specific_task)
        expect(room_tasks).not_to include(general_task)
      end
    end

    describe '.general' do
      it 'returns only general tasks' do
        general_tasks = Task.general
        expect(general_tasks).to include(general_task)
        expect(general_tasks).not_to include(room_specific_task)
      end
    end
  end

  describe 'factory' do
    it 'creates a valid task' do
      task = build(:task)
      expect(task).to be_valid
    end

    it 'creates tasks with different traits' do
      pack_task = create(:task, :pack)
      clean_task = create(:task, :clean)
      
      expect(pack_task.category).to eq('pack')
      expect(clean_task.category).to eq('clean')
    end
  end

  describe 'business logic' do
    describe '#applies_to_room_type?' do
      it 'returns true for non-room-specific tasks' do
        task = create(:task, is_room_specific: false)
        expect(task.applies_to_room_type?('kitchen')).to be true
      end

      it 'returns true when room type is in applicable_room_types' do
        task = create(:task, is_room_specific: true, applicable_room_types: ['kitchen'])
        expect(task.applies_to_room_type?('kitchen')).to be true
      end

      it 'returns false when room type is not in applicable_room_types' do
        task = create(:task, is_room_specific: true, applicable_room_types: ['bathroom'])
        expect(task.applies_to_room_type?('kitchen')).to be false
      end
    end

    describe '#generate_name_for_room' do
      it 'replaces {room_name} placeholder for room-specific tasks' do
        task = create(:task, is_room_specific: true, name: 'Pack {room_name} items')
        expect(task.generate_name_for_room('Kitchen')).to eq('Pack Kitchen items')
      end

      it 'returns original name for non-room-specific tasks' do
        task = create(:task, is_room_specific: false, name: 'Hire movers')
        expect(task.generate_name_for_room('Kitchen')).to eq('Hire movers')
      end
    end
  end
end
