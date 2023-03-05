# == Schema Information
#
# Table name: rounds
#
#  id         :bigint           not null, primary key
#  created_at :datetime         not null
#  updated_at :datetime         not null
#  student_id :bigint           not null
#
# Indexes
#
#  index_rounds_on_student_id  (student_id)
#
# Foreign Keys
#
#  fk_rails_...  (student_id => users.id)
#
class Round < ApplicationRecord
  belongs_to :student, class_name: "User"
  has_many :attempts
  has_many :exercises, :through => :attempts
end
