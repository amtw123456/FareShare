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

ActiveRecord::Schema[7.2].define(version: 2024_10_21_032338) do
  # These are extensions that must be enabled in order to support this database
  enable_extension "plpgsql"

  create_table "transaction_entries", force: :cascade do |t|
    t.decimal "amount"
    t.string "title"
    t.string "description"
    t.bigint "user_id", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.decimal "lat"
    t.decimal "long"
    t.index ["user_id"], name: "index_transaction_entries_on_user_id"
  end

  create_table "transaction_related_users", force: :cascade do |t|
    t.decimal "amount"
    t.bigint "user_id", null: false
    t.bigint "transaction_entry_id", null: false
    t.boolean "paid"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["transaction_entry_id"], name: "index_transaction_related_users_on_transaction_entry_id"
    t.index ["user_id"], name: "index_transaction_related_users_on_user_id"
  end

  create_table "users", force: :cascade do |t|
    t.string "first_name"
    t.string "last_name"
    t.string "user_name"
    t.string "email"
    t.string "password_digest"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["email"], name: "index_users_on_email", unique: true
    t.index ["user_name"], name: "index_users_on_user_name", unique: true
  end

  add_foreign_key "transaction_entries", "users"
  add_foreign_key "transaction_related_users", "transaction_entries"
  add_foreign_key "transaction_related_users", "users"
end
