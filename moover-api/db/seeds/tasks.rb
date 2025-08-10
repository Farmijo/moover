# Seeds para tareas basadas en planning real de mudanza

puts "🌱 Creando tareas de mudanza..."

Task.destroy_all

# ===============================
# TAREAS GENERALES (4-1 semanas antes)
# ===============================

Task.create!([
  {
    name: "Comprar cajas, cinta, marcador, papel burbuja, bolsas de vacío",
    description: "Conseguir material de embalaje necesario para toda la mudanza",
    category: "preparation",
    is_room_specific: false,
    timing: -30
  },
  {
    name: "Contactar empresa de mudanza",
    description: "Buscar, comparar presupuestos y contratar empresa de mudanza",
    category: "logistics",
    is_room_specific: false,
    timing: -28
  },
  {
    name: "Preguntar si transportan plantas, instrumentos y productos de limpieza",
    description: "Confirmar qué elementos especiales puede transportar la empresa",
    category: "logistics",
    is_room_specific: false,
    timing: -28
  },
  {
    name: "Clasificar documentos importantes (contrato, DNI, etc.)",
    description: "Reunir y organizar documentación esencial en lugar seguro",
    category: "admin",
    is_room_specific: false,
    timing: -25
  }
])

# ===============================
# TAREAS POR HABITACIÓN - EMBALAJE
# ===============================

packing_tasks = [
  {
    name: "Embalar {room_name}",
    description: "Embalar todas las pertenencias de {room_name}, etiquetando las cajas",
    category: "pack",
    timing: -21,
    applicable_room_types: %w[bedroom office storage_room]
  },
  {
    name: "Embalar vajilla y cristalería de {room_name}",
    description: "Embalar cuidadosamente vajilla, copas y objetos frágiles",
    category: "pack",
    timing: -21,
    applicable_room_types: %w[kitchen living_room]
  },
  {
    name: "Embalar productos de higiene de {room_name}",
    description: "Embalar cosmética, medicinas y productos de higiene personal",
    category: "pack",
    timing: -14,
    applicable_room_types: %w[bathroom]
  },
  {
    name: "Embalar herramientas de {room_name}",
    description: "Embalar herramientas y materiales de bricolaje en caja resistente",
    category: "pack",
    timing: -14,
    applicable_room_types: %w[garage terrace basement storage_room]
  },
  {
    name: "Preparar plantas de {room_name}",
    description: "Seleccionar plantas a llevar, reducir riego, preparar transporte",
    category: "pack",
    timing: -14,
    applicable_room_types: %w[balcony terrace garden patio]
  }
]

packing_tasks.each do |task_data|
  Task.create!(
    name: task_data[:name],
    description: task_data[:description],
    category: task_data[:category],
    is_room_specific: true,
    timing: task_data[:timing],
    applicable_room_types: task_data[:applicable_room_types]
  )
end

# ===============================
# TAREAS ESPECÍFICAS POR TIPO DE HABITACIÓN
# ===============================

Task.create!([
  {
    name: "Separar comida de despensa que no usarás",
    description: "Revisar despensa y donar/consumir alimentos que no llevarás",
    category: "preparation",
    is_room_specific: true,
    timing: -14,
    applicable_room_types: %w[kitchen]
  },
  {
    name: "Vaciar y limpiar nevera de {room_name}",
    description: "Consumir alimentos perecederos, limpiar y descongelar nevera",
    category: "clean",
    is_room_specific: true,
    timing: -7,
    applicable_room_types: %w[kitchen]
  },
  {
    name: "Embalar ropa de fuera de temporada de {room_name}",
    description: "Embalar primero la ropa que no usarás en las próximas semanas",
    category: "pack",
    is_room_specific: true,
    timing: -21,
    applicable_room_types: %w[bedroom]
  },
  {
    name: "Maleta con ropa para varios días",
    description: "Preparar maleta con ropa para los primeros días después de la mudanza",
    category: "preparation",
    is_room_specific: true,
    timing: -3,
    applicable_room_types: %w[bedroom]
  }
])

# ===============================
# TAREAS SEMANA DE LA MUDANZA
# ===============================

Task.create!([
  {
    name: "Confirmar detalles con empresa de mudanza",
    description: "Confirmar fecha, hora, dirección y condiciones especiales",
    category: "logistics",
    is_room_specific: false,
    timing: -7
  },
  {
    name: "Preparar kit de supervivencia",
    description: "Caja con básicos: ropa, toalla, medicinas, cargadores, snacks, agua",
    category: "preparation",
    is_room_specific: false,
    timing: -3
  },
  {
    name: "Hacer limpieza general",
    description: "Limpieza profunda de baños, cocina y suelos",
    category: "clean",
    is_room_specific: false,
    timing: -1
  }
])

# ===============================
# DÍA DE MUDANZA
# ===============================

Task.create!([
  {
    name: "Supervisar carga de muebles y cajas",
    description: "Estar presente durante la carga, verificar inventario",
    category: "moving_day",
    is_room_specific: false,
    timing: 0
  },
  {
    name: "Revisar que todo se ha vaciado",
    description: "Check final: armarios, trasteros, balcones completamente vacíos",
    category: "moving_day",
    is_room_specific: false,
    timing: 0
  },
  {
    name: "Apuntar lectura de contadores",
    description: "Anotar lecturas finales de luz, agua y gas",
    category: "admin",
    is_room_specific: false,
    timing: 0
  },
  {
    name: "Hacer fotos de estado final",
    description: "Documentar estado del piso vacío para entrega",
    category: "admin",
    is_room_specific: false,
    timing: 0
  }
])

# ===============================
# POST-MUDANZA
# ===============================
Task.create!([
  {
    name: "Montar muebles principales",
    description: "Organiza la disposición inicial de los muebles más importantes",
    category: "logistics",
    is_room_specific: false,
    timing: 1
  },
  {
    name: "Desembalar caja de básicos",
    description: "Desembala la caja con objetos esenciales para los primeros días",
    category: "pack",
    is_room_specific: false,
    timing: 1
  },
  {
    name: "Configurar wifi e internet",
    description: "Verifica que la conexión funcione o contacta con el proveedor",
    category: "admin",
    is_room_specific: false,
    timing: 2
  },
  {
    name: "Cambiar dirección en bancos y documentos",
    description: "Actualiza tu dirección en el DNI, bancos, seguros y otros organismos",
    category: "admin",
    is_room_specific: false,
    timing: 3
  },
  {
    name: "Registrar suministros (agua, luz, gas)",
    description: "Comprueba que los contratos estén a tu nombre y activos",
    category: "admin",
    is_room_specific: false,
    timing: 3
  },
  {
    name: "Hacer limpieza final del nuevo hogar",
    description: "Una limpieza rápida para quitar polvo de transporte o montaje",
    category: "clean",
    is_room_specific: false,
    timing: 2
  },
  {
    name: "Avisar portería o conocer vecinos",
    description: "Haz saber que ya estás instalado y agradece su colaboración si la hubo",
    category: "admin",
    is_room_specific: false,
    timing: 5
  }
])

# ===============================
# Preparatorias
# ===============================

Task.create!([
  {
    name: "Hacer inventario emocional",
    description: "Decide qué objetos significativos quieres conservar o dejar atrás",
    category: "admin",
    is_room_specific: false,
    timing: -10
  },
  {
    name: "Planificar primeras comidas en el nuevo hogar",
    description: "Piensa en qué cocinarás los primeros días sin tener todo colocado",
    category: "logistics",
    is_room_specific: false,
    timing: -3
  },
  {
    name: "Confirmar ayuda para el día de mudanza",
    description: "Asegúrate de tener personas de confianza disponibles ese día",
    category: "logistics",
    is_room_specific: false,
    timing: -5
  }
])


# ===============================
# REPORT FINAL
# ===============================

puts "✅ Creadas #{Task.count} tareas de mudanza"
puts "   - Generales: #{Task.where(is_room_specific: false).count}"
puts "   - Por habitación: #{Task.where(is_room_specific: true).count}"
puts "   - Por categoría:"
Task.group(:category).count.each do |category, count|
  puts "     * #{category.to_s.humanize}: #{count}"
end
