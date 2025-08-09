class CreateRooms < ActiveRecord::Migration[7.1]
  def change
    create_table :rooms do |t|
      t.references :move, null: false, foreign_key: true
      t.string :name
      t.integer :room_type

      t.timestamps
    end
  end
end
