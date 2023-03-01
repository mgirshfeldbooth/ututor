# == Schema Information
#
# Table name: plans
#
#  id         :bigint           not null, primary key
#  round_size :string
#  created_at :datetime         not null
#  updated_at :datetime         not null
#  student_id :bigint           not null
#  subject_id :bigint           not null
#  tutor_id   :bigint           not null
#
# Indexes
#
#  index_plans_on_student_id  (student_id)
#  index_plans_on_subject_id  (subject_id)
#  index_plans_on_tutor_id    (tutor_id)
#
# Foreign Keys
#
#  fk_rails_...  (student_id => users.id)
#  fk_rails_...  (subject_id => subjects.id)
#  fk_rails_...  (tutor_id => users.id)
#
class Plan < ApplicationRecord
  belongs_to :tutor, class_name: "User"
  belongs_to :student, class_name: "User"
  belongs_to :subject
end
