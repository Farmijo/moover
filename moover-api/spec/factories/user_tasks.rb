FactoryBot.define do
  factory :user_task do
    association :move
    association :task
    association :room, factory: :room
    name { "#{task&.name || 'Default Task'} for #{room&.name || 'General'}" }
    completed { false }
    due_date { task&.timing ? move.origin_move_out_date + task.timing.days : 1.week.from_now }

    trait :completed do
      completed { true }
      completed_at { 1.day.ago }
    end

    trait :pending do
      completed { false }
      completed_at { nil }
    end

    trait :overdue do
      completed { false }
      due_date { 1.week.ago }
    end

    trait :general_task do
      room { nil }
      task { create(:task, is_room_specific: false) }
      name { task&.name || 'General Task' }
    end

    trait :room_specific_task do
      task { create(:task, is_room_specific: true) }
      name { "#{task&.name || 'Room Task'} for #{room&.name}" }
    end
  end
end
