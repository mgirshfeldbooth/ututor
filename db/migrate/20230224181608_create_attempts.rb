class CreateAttempts < ActiveRecord::Migration[6.1]
  def change
    create_table :attempts do |t|
      t.float :submission
      t.boolean :correct
      t.datetime :started_at
      t.datetime :finished_at
      t.references :exercise, null: false, foreign_key: true
      t.references :round, null: false, foreign_key: true
      t.references :student, null: false, foreign_key: { to_table: :users }, index: true

      t.timestamps
    end
  end
end
