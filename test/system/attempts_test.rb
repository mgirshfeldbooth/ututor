require "application_system_test_case"

class AttemptsTest < ApplicationSystemTestCase
  setup do
    @attempt = attempts(:one)
  end

  test "visiting the index" do
    visit attempts_url
    assert_selector "h1", text: "Attempts"
  end

  test "creating a Attempt" do
    visit attempts_url
    click_on "New Attempt"

    check "Correct" if @attempt.correct
    fill_in "Exercise", with: @attempt.exercise_id
    fill_in "Finished at", with: @attempt.finished_at
    fill_in "Round", with: @attempt.round_id
    fill_in "Started at", with: @attempt.started_at
    fill_in "Student", with: @attempt.student_id
    fill_in "Submission", with: @attempt.submission
    click_on "Create Attempt"

    assert_text "Attempt was successfully created"
    click_on "Back"
  end

  test "updating a Attempt" do
    visit attempts_url
    click_on "Edit", match: :first

    check "Correct" if @attempt.correct
    fill_in "Exercise", with: @attempt.exercise_id
    fill_in "Finished at", with: @attempt.finished_at
    fill_in "Round", with: @attempt.round_id
    fill_in "Started at", with: @attempt.started_at
    fill_in "Student", with: @attempt.student_id
    fill_in "Submission", with: @attempt.submission
    click_on "Update Attempt"

    assert_text "Attempt was successfully updated"
    click_on "Back"
  end

  test "destroying a Attempt" do
    visit attempts_url
    page.accept_confirm do
      click_on "Destroy", match: :first
    end

    assert_text "Attempt was successfully destroyed"
  end
end
