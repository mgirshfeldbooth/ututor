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
require "test_helper"

class RoundTest < ActiveSupport::TestCase
  # test "the truth" do
  #   assert true
  # end
end
