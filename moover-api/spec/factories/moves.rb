FactoryBot.define do
  factory :move do
    association :user
    origin_address { "#{Faker::Address.street_address}, #{Faker::Address.city}" }
    destination_address { "#{Faker::Address.street_address}, #{Faker::Address.city}" }
    move_type { %w[apartment house office storage].sample }
    status { 'planning' }

    
    destination_key_delivery_date { 2.weeks.from_now }
    origin_move_out_date { 3.weeks.from_now }
    origin_key_delivery_date { 4.weeks.from_now }

    trait :planning do
      status { 'planning' }
    end

    trait :in_progress do
      status { 'in_progress' }
    end

    trait :completed do
      status { 'completed' }
    end

    trait :apartment do
      move_type { 'apartment' }
    end

    trait :house do
      move_type { 'house' }
    end

    trait :office do
      move_type { 'office' }
    end
  end
end
