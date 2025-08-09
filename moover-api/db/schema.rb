# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# This file is the source Rails uses to define your schema when running `bin/rails
# db:schema:load`. When creating a new database, `bin/rails db:schema:load` tends to
# be faster and is potentially less error prone than running all of your
# migrations from scratch. Old migrations may fail to apply correctly if those
# migrations use external dependencies or application code.
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema[7.1].define(version: 2025_08_09_155333) do
  create_table "moves", force: :cascade do |t|
    t.integer "user_id", null: false
    t.string "origin_address", null: false
    t.string "destination_address", null: false
    t.integer "move_type", default: 0, null: false
    t.date "origin_key_delivery_date"
    t.date "origin_move_out_date"
    t.date "destination_key_delivery_date"
    t.integer "status", default: 0, null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["status"], name: "index_moves_on_status"
    t.index ["user_id"], name: "index_moves_on_user_id"
  end

  create_table "rooms", force: :cascade do |t|
    t.integer "move_id", null: false
    t.string "name"
    t.integer "room_type"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["move_id"], name: "index_rooms_on_move_id"
  end

  create_table "tasks", force: :cascade do |t|
    t.string "name"
    t.text "description"
    t.boolean "is_room_specific"
    t.integer "timing"
    t.string "category"
    t.text "applicable_room_types"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  create_table "user_tasks", force: :cascade do |t|
    t.integer "move_id", null: false
    t.integer "task_id", null: false
    t.integer "room_id"
    t.string "name"
    t.boolean "completed"
    t.datetime "completed_at"
    t.date "due_date"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["move_id"], name: "index_user_tasks_on_move_id"
    t.index ["room_id"], name: "index_user_tasks_on_room_id"
    t.index ["task_id"], name: "index_user_tasks_on_task_id"
  end

  create_table "users", force: :cascade do |t|
    t.string "email"
    t.string "password_digest"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  add_foreign_key "moves", "users"
  add_foreign_key "rooms", "moves"
  add_foreign_key "user_tasks", "moves"
  add_foreign_key "user_tasks", "rooms"
  add_foreign_key "user_tasks", "tasks"
end
