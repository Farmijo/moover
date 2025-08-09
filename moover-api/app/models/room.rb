class Room < ApplicationRecord
  belongs_to :move
  has_many :user_tasks, dependent: :destroy
  
  # Enum basado en tu planning + típicos + exteriores
  enum room_type: {
    bathroom: 0,           # 🛁 Baño 1, Baño 2 (trastero)
    bedroom: 1,            # �️ Habitación principal
    kitchen: 2,            # �️ Cocina
    living_room: 3,        # 🛋️ Salón-comedor
    office: 4,             # 💼 Despacho
    storage_room: 5,       # � Habitación trastero  
    terrace: 6,            # � Terraza
    balcony: 7,            # 🌿 Balcón
    garage: 8,             # 🚗 Garaje
    basement: 9,           # 🏠 Sótano/bodega
    attic: 10,             # 🏠 Ático/desván
    laundry_room: 11,      # 🧺 Lavadero/cuarto de lavado
    pantry: 12,            # 📦 Despensa
    entrance_hall: 13,     # 🚪 Recibidor/hall
    garden: 14,            # 🌿 Jardín
    patio: 15,             # 🌿 Patio  
    pool_area: 16,         # 🏊 Zona de piscina
    other: 17
  }
  
  validates :name, presence: true
  validates :room_type, presence: true
  validates :name, uniqueness: { scope: :move_id }
  
  # Helper para display
  def display_name
    "#{room_type.humanize}: #{name}"
  end
end
