class CreateExercises < ActiveRecord::Migration[6.1]
  def change
    create_table :exercises do |t|
      t.string :question
      t.string :answer
      t.integer :difficulty
      t.references :subject, null: false, foreign_key: true, index: true

      t.timestamps
    end
  end
end
