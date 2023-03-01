# == Schema Information
#
# Table name: attempts
#
#  id          :bigint           not null, primary key
#  correct     :boolean
#  finished_at :datetime
#  started_at  :datetime
#  submission  :float
#  created_at  :datetime         not null
#  updated_at  :datetime         not null
#  exercise_id :bigint           not null
#  round_id    :bigint           not null
#  student_id  :bigint           not null
#
# Indexes
#
#  index_attempts_on_exercise_id  (exercise_id)
#  index_attempts_on_round_id     (round_id)
#  index_attempts_on_student_id   (student_id)
#
# Foreign Keys
#
#  fk_rails_...  (exercise_id => exercises.id)
#  fk_rails_...  (round_id => rounds.id)
#  fk_rails_...  (student_id => users.id)
#
require "test_helper"

class AttemptTest < ActiveSupport::TestCase
  # test "the truth" do
  #   assert true
  # end
end
