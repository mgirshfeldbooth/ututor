require "test_helper"

class AttemptsControllerTest < ActionDispatch::IntegrationTest
  setup do
    @attempt = attempts(:one)
  end

  test "should get index" do
    get attempts_url
    assert_response :success
  end

  test "should get new" do
    get new_attempt_url
    assert_response :success
  end

  test "should create attempt" do
    assert_difference('Attempt.count') do
      post attempts_url, params: { attempt: { correct: @attempt.correct, exercise_id: @attempt.exercise_id, finished_at: @attempt.finished_at, round_id: @attempt.round_id, started_at: @attempt.started_at, student_id: @attempt.student_id, submission: @attempt.submission } }
    end

    assert_redirected_to attempt_url(Attempt.last)
  end

  test "should show attempt" do
    get attempt_url(@attempt)
    assert_response :success
  end

  test "should get edit" do
    get edit_attempt_url(@attempt)
    assert_response :success
  end

  test "should update attempt" do
    patch attempt_url(@attempt), params: { attempt: { correct: @attempt.correct, exercise_id: @attempt.exercise_id, finished_at: @attempt.finished_at, round_id: @attempt.round_id, started_at: @attempt.started_at, student_id: @attempt.student_id, submission: @attempt.submission } }
    assert_redirected_to attempt_url(@attempt)
  end

  test "should destroy attempt" do
    assert_difference('Attempt.count', -1) do
      delete attempt_url(@attempt)
    end

    assert_redirected_to attempts_url
  end
end
