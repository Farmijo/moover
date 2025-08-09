class CreateMoves < ActiveRecord::Migration[7.1]
  def change
    create_table :moves do |t|
      t.references :user, null: false, foreign_key: true
      t.string :origin_address, null: false
      t.string :destination_address, null: false
      t.integer :move_type, default: 0, null: false
      t.date :origin_key_delivery_date
      t.date :origin_move_out_date
      t.date :destination_key_delivery_date
      t.integer :status, default: 0, null: false

      t.timestamps
    end
    
    add_index :moves, :status
  end
end
