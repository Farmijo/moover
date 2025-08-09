FactoryBot.define do
  factory :room do
    association :move
    name { "#{room_type.humanize} #{rand(1..3)}" }
    room_type { Room.room_types.keys.sample }

    trait :living_room do
      room_type { 'living_room' }
      name { 'Sala de Estar Principal' }
    end

    trait :bedroom do
      room_type { 'bedroom' }
      name { 'Dormitorio Principal' }
    end

    trait :kitchen do
      room_type { 'kitchen' }
      name { 'Cocina' }
    end

    trait :bathroom do
      room_type { 'bathroom' }
      name { 'Baño Completo' }
    end

    trait :dining_room do
      room_type { 'dining_room' }
      name { 'Comedor' }
    end

    trait :office do
      room_type { 'office' }
      name { 'Oficina' }
    end
  end
end
