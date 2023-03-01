# == Schema Information
#
# Table name: exercises
#
#  id         :bigint           not null, primary key
#  answer     :string
#  difficulty :integer
#  question   :string
#  created_at :datetime         not null
#  updated_at :datetime         not null
#  subject_id :bigint           not null
#
# Indexes
#
#  index_exercises_on_subject_id  (subject_id)
#
# Foreign Keys
#
#  fk_rails_...  (subject_id => subjects.id)
#
require "test_helper"

class ExerciseTest < ActiveSupport::TestCase
  # test "the truth" do
  #   assert true
  # end
end
