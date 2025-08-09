class CreateUserTasks < ActiveRecord::Migration[7.1]
  def change
    create_table :user_tasks do |t|
      t.references :move, null: false, foreign_key: true
      t.references :task, null: false, foreign_key: true
      t.references :room, null: false, foreign_key: true
      t.string :name
      t.boolean :completed
      t.datetime :completed_at
      t.date :due_date

      t.timestamps
    end
  end
end
