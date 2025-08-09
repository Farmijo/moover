FactoryBot.define do
  factory :task do
    name { Faker::Lorem.sentence(word_count: 5) }
    description { Faker::Lorem.paragraph(sentence_count: 2) }
    category { Task::CATEGORIES.sample }
    is_room_specific { [true, false].sample }
    timing { rand(-30..7) }
    applicable_room_types { is_room_specific ? [Room.room_types.keys.sample] : [] }

    trait :pack do
      category { 'pack' }
      name { 'Embalar objetos frágiles' }
      description { 'Empacar cuidadosamente todos los objetos frágiles con papel burbuja' }
      is_room_specific { true }
      applicable_room_types { %w[kitchen dining_room] }
      timing { -10 }
    end

    trait :clean do
      category { 'clean' }
      name { 'Limpiar a fondo la habitación' }
      description { 'Realizar limpieza profunda antes de la entrega' }
      is_room_specific { true }
      timing { 1 }
    end

    trait :admin do
      category { 'admin' }
      name { 'Notificar cambio de dirección' }
      description { 'Contactar servicios para actualizar dirección' }
      is_room_specific { false }
      applicable_room_types { [] }
      timing { -14 }
    end

    trait :logistics do
      category { 'logistics' }
      name { 'Contratar empresa de mudanza' }
      description { 'Buscar y contratar empresa de mudanza confiable' }
      is_room_specific { false }
      applicable_room_types { [] }
      timing { -21 }
    end

    trait :preparation do
      category { 'preparation' }
      name { 'Comprar materiales de embalaje' }
      description { 'Adquirir cajas, cinta, papel burbuja y marcadores' }
      is_room_specific { false }
      applicable_room_types { [] }
      timing { -30 }
    end

    trait :moving_day do
      category { 'moving_day' }
      name { 'Supervisar la carga' }
      description { 'Estar presente durante la carga de los muebles' }
      is_room_specific { false }
      applicable_room_types { [] }
      timing { 0 }
    end
  end
end
