require 'csv'

namespace :import do
  desc "Import users from a CSV file"
  task tutoring_chicago_users => :environment do
    file_path = Rails.root.join("lib", "csvs", "tutoring_chicago.csv")

    if file_path.nil?
      puts "Please provide a CSV file path via the CSV_FILE environment variable."
      exit
    end

    CSV.foreach(file_path, headers: true) do |row|
      user_attributes = {
        email: row['Email'],
        password: row['Password'],
        password_confirmation: row['Password'],
        role: row['Role'],
        grade: row['Grade'],
        organization: row['Organization']
      }.compact

      user = User.new(user_attributes)

      if user.save
        puts "Created user: #{user.email}"
      else
        puts "Failed to create user: #{user.email} - #{user.errors.full_messages.join(', ')}"
      end
    end
  end
end
