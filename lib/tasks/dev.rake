task sample_data: :environment do
  p "Creating sample data"

  t = User.create(
    email: "tommy@example.com",
    username: "tommy",
    password: "password",
    role: "tutor"
  )

  s = User.create(
    email: "stu@example.com",
    username: "stu",
    password: "password",
    role: "student"
  )

  10.times do
    name = Faker::Name.first_name.downcase
    u = User.create(
      email: "#{name}@example.com",
      username: name,
      password: "password",
      role: ["student", "tutor"].sample
    )
    p name
  end

  p "#{User.count} users have been created"
end
