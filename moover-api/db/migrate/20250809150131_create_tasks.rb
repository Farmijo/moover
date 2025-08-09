class CreateTasks < ActiveRecord::Migration[7.1]
  def change
    create_table :tasks do |t|
      t.string :name
      t.text :description
      t.boolean :is_room_specific
      t.integer :timing
      t.string :category
      t.text :applicable_room_types

      t.timestamps
    end
  end
end
