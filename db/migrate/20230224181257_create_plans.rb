class CreatePlans < ActiveRecord::Migration[6.1]
  def change
    create_table :plans do |t|
      t.references :tutor, null: false, foreign_key: { to_table: :users }, index: true
      t.references :student, null: false, foreign_key: { to_table: :users }, index: true
      t.references :subject, null: false, foreign_key: true, index: true
      t.integer :round_size

      t.timestamps
    end
  end
end
