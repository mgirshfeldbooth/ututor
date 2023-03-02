## How to setup the dev environment

1. Install ruby 3.0.3 (should use rbenv to manage ruby versions)
2. Run `bundle install`
3. Install `yarn`
4. Run `yarn`
5. Install `postgres` and ensure postgres service is running
6. Setup DB: `bundle e rails db:setup` and run migrations `bundle e rails db:migrate`
7. Run the rails server `bundle e rails s`
