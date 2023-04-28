namespace :populate_attempts do
  desc "Populate attempts table with 10 days of data for user_id 2 (Stu)"
  task create_attempts: :environment do
    user_id = 3
    exercises = Exercise.all

    10.times do |i|
      date = i.days.ago
      attempts_count = rand(10..30)

      # Create a new round for each day
      round = Round.create(student_id: user_id, created_at: date, updated_at: date)

      attempts_count.times do
        attempt = Attempt.new(
          student_id: user_id,
          round_id: round.id,
          exercise_id: exercises.sample.id,
          correct: [true, false].sample,
          started_at: date,
          finished_at: date + rand(1..5).minutes,
          submission: rand(0.0..100.0).round(1),
          created_at: date,
          updated_at: date,
        )

        attempt.save!
      end
    end

    puts "Finished populating attempts table with 10 days of data for user_id 2."
  end
end
