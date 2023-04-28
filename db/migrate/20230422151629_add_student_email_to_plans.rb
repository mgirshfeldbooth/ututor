class AddStudentEmailToPlans < ActiveRecord::Migration[6.1]
  def change
    add_column :plans, :student_email, :string
  end
end
