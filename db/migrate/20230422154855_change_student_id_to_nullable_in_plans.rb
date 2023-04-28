class ChangeStudentIdToNullableInPlans < ActiveRecord::Migration[6.1]
  def change
    change_column_null :plans, :student_id, true
  end
end
