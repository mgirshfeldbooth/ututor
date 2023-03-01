namespace :slurp do
  desc "TODO"

  task subjectfile: :environment do
    require "csv"

    csv_text = File.read(Rails.root.join("lib", "csvs", "subjectfile.csv"))
    csv = CSV.parse(csv_text, :headers => true, :encoding => "ISO-8859-1")
    csv.each do |row|
      e = Subject.new
      e.id = row["id"]
      e.name = row["name"]
      e.save

      puts "#{e.name} saved"
    end
    puts "There are now #{Subject.count} rows in the Subjects table"
  end


  task exercisefile: :environment do
    require "csv"

    csv_text = File.read(Rails.root.join("lib", "csvs", "exercisefile.csv"))
    csv = CSV.parse(csv_text, :headers => true, :encoding => "ISO-8859-1")
    csv.each do |row|
      e = Exercise.new
      e.question = row["Question"]
      e.answer = row["Answer"]
      e.difficulty = row["Difficulty"]
      e.subject_id = row["Subject_id"]
      e.save

      puts "#{e.question} = #{e.answer} saved"
    end
    puts "There are now #{Exercise.count} rows in the Exercises table"
  end

end
