class CreateRounds < ActiveRecord::Migration[6.1]
  def change
    create_table :rounds do |t|
      t.references :student, null: false, foreign_key: { to_table: :users }, index: true

      t.timestamps
    end
  end
end
