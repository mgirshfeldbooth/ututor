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

ActiveRecord::Schema.define(version: 2023_05_01_165706) do

  # These are extensions that must be enabled in order to support this database
  enable_extension "citext"
  enable_extension "plpgsql"

  create_table "attempts", force: :cascade do |t|
    t.float "submission"
    t.boolean "correct"
    t.datetime "started_at"
    t.datetime "finished_at"
    t.bigint "exercise_id", null: false
    t.bigint "round_id", null: false
    t.bigint "student_id", null: false
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.index ["exercise_id"], name: "index_attempts_on_exercise_id"
    t.index ["round_id"], name: "index_attempts_on_round_id"
    t.index ["student_id"], name: "index_attempts_on_student_id"
  end

  create_table "exercises", force: :cascade do |t|
    t.string "question"
    t.string "answer"
    t.integer "difficulty"
    t.bigint "subject_id", null: false
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.index ["subject_id"], name: "index_exercises_on_subject_id"
  end

  create_table "plans", force: :cascade do |t|
    t.bigint "tutor_id", null: false
    t.bigint "student_id"
    t.bigint "subject_id", null: false
    t.integer "round_size"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.string "student_email"
    t.index ["student_id"], name: "index_plans_on_student_id"
    t.index ["subject_id"], name: "index_plans_on_subject_id"
    t.index ["tutor_id"], name: "index_plans_on_tutor_id"
  end

  create_table "rounds", force: :cascade do |t|
    t.bigint "student_id", null: false
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.index ["student_id"], name: "index_rounds_on_student_id"
  end

  create_table "subjects", force: :cascade do |t|
    t.string "name"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
  end

  create_table "users", force: :cascade do |t|
    t.citext "email", default: "", null: false
    t.string "encrypted_password", default: "", null: false
    t.string "reset_password_token"
    t.datetime "reset_password_sent_at"
    t.datetime "remember_created_at"
    t.citext "username"
    t.string "role", default: "student"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.integer "grade"
    t.string "organization"
    t.string "parent_email"
    t.index ["email"], name: "index_users_on_email", unique: true
    t.index ["reset_password_token"], name: "index_users_on_reset_password_token", unique: true
  end

  add_foreign_key "attempts", "exercises"
  add_foreign_key "attempts", "rounds"
  add_foreign_key "attempts", "users", column: "student_id"
  add_foreign_key "exercises", "subjects"
  add_foreign_key "plans", "subjects"
  add_foreign_key "plans", "users", column: "student_id"
  add_foreign_key "plans", "users", column: "tutor_id"
  add_foreign_key "rounds", "users", column: "student_id"
end
