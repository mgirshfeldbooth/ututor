# Photogram Industrial

In this project, we'll rebuild Photogram once more, but we'll do it without cutting any corners — we'll use database indexes and constraints, advanced association accessors, scopes, validations, view helper methods like `link_to` and `form_with` everywhere, partials to DRY up code judiciously, the Devise gem for authentication and password reset emails, authorizing access to each action explicitly, and many other industrial-strength upgrades.

## Target

[Here is a rough target to work towards.](https://pg-industrial-2-final.herokuapp.com/)

## Add collaborators

As we work on this project, we're also going to practice using Git, providing and receiving Code Review.

So first things first: click on the **Settings** tab of your repository, **Manage Access**, and add `raghubetina`, `rsfarzo`, and `jelaniwoods` as collaborators.

[Here is a cheat sheet for our Git workflow.](https://chapters.firstdraft.com/chapters/859)

## Steps

### ERD

Currently, this is a blank application. Here is an ERD of the models that we want:

![Domain Model](erd.png?raw=true "Domain Model")

### User accounts with Devise

For user accounts, we're going to use the Devise gem rather than the `draft:account` generator as we did in AppDev 1. The basic process is the same: we can generate it and then forget about authentication, using the `current_user` helper method in all controllers and views.

#### Installation

  - Add `gem 'devise'` to your `Gemfile` (in this project it's already there).
  - `rails generate devise:install`
  - Follow the instructions that appear in the terminal.
      - Add `config.action_mailer.default_url_options = { host: 'localhost', port: 3000 }` to `config/development.rb`.
      - Remember to define a root route soon; we don't have one to use yet, but `root "photos#index"` will work soon.
  - Make a Git commit.

[Read more about installing Devise here.](https://chapters.firstdraft.com/chapters/880)

#### Generate Devise model

Now we're ready to generate user accounts:

```
rails generate devise user username private:boolean likes_count:integer comments_count:integer
```

 - `g` is short for `generate` in the `rails` command above, like `c` is short for `console` and `s` is short for `server`.
 - I could drop `:string` after `username` because `string` is the default datatype.

#### Default values for columns

As always after generating any model, you should review the generated migration and decide if you want to make any changes to it before you run it. For example, in this case we should probably add default values of `0` to the counter columns, e.g.:

```ruby
t.integer :likes_count, default: 0
```

#### Database indexes

Notice that Devise automatically added a line to the migration:

```ruby
add_index :users, :email, unique: true
```

A database index will speed up looking up a record by that column. Usually we do lookups by primary key or foreign key columns, but if you have any other columns that you plan to look up records by (usually things like `email` or `username`), then it's a good idea to add indexes to those columns (although you can always add them later if you notice slowness).

#### Database constraints

In addition, you can use the `unique: true` option. This will add a _database constraint_ enforcing uniqueness within the column at the database level, which is a stronger guarantee than an ActiveRecord validation (model validations still allow for ["race conditions"](https://en.wikipedia.org/wiki/Race_condition)).

Devise knows that we want both an index and a uniqueness constraint for `email` since that's what we uniquely identify and look up accounts by, so it goes ahead adds both automatically. Since in this app we decided to have a `username` column that we're probably going to be using similarly, let's add an index and a uniqueness constraint for it:

```ruby
add_index :users, :username, unique: true
```

#### Case-insensitive text column

An advanced optimization that we can make since we're using the PostgreSQL database is to use a case-insensitive column for `username`. That way, when doing lookups, we won't have to worry about `RaGhU` not matching `raghu`, or normalizing by downcasing or upcasing before every lookup; the database will take care of it for us. [You can read more here.](https://mikecoutermarsh.com/storing-email-in-postgres-rails-use-citext/)

We can enable this feature by adding a line at the very top of the `change` method in the migration file:

```
enable_extension("citext")
```

Then we can change the `username` column to use it:

```
# t.string :username
t.citext :username
```

We can change the email column too, although we don't really need to worry about it since Devise is taking care of all of the sign-in-related logic for us.

This is an example of a database-specific feature. In AppDev 1, we used a lightweight database called SQLite that did not have `citext` column support. PostgreSQL has many other excellent features (JSON datatype, range datatype, ordering by geographic distance, full-text search), and Rails provides first-class support for many of them; [see this Rails Guide for a rundown](https://guides.rubyonrails.org/active_record_postgresql.html).

When you're satisfied with your migration, `rails db:migrate` and `git commit`.

### Scaffold vs model

For each resource which does not represent user accounts, decide whether you want to generate only a `model` or a full `scaffold`.

My usual rule of thumb:

 - If I will need routes and controller/actions for users to be able to CRUD records in the table, then I probably want to generate `scaffold`. (At least some of the generated routes/actions/views will go unused. I need to remember to go back and at least disable the routes, and eventually delete the entire RCAVs, at some point; or I risk introducing security holes.)
 - If the model will only be used on the backend, e.g. by other models, then I probably want to generate `model`. For example, a `Month` model where I will create all twelve records once in `db/seeds.rb` does not require routes, `MonthsController`, `app/views/months/`, etc.

In this case, since users will be CRUDing all of the remaining resources, we'll `scaffold` them. Lets generate the photos resource first:

```
rails generate scaffold photo image comments_count:integer likes_count:integer caption:text owner:references
```

#### belongs_to/references in migrations

Notice that I used `owner:references` instead of what you might have been expecting, `owner_id:integer`. (An alias for `owner:references` is `owner:belongs_to`.) Go take a look at the generated migration file and you'll see something like this:

```ruby
t.belongs_to :owner, null: false, foreign_key: true
```

If we ran this migration as-is,

 - Even though it says `t.belongs_to` instead of the usual `t.integer`, the datatype would be `integer` (or whatever the default datatype is for primary keys for the database you are using; [I commonly use UUIDs these days](https://pawelurbanek.com/uuid-order-rails)).
 - The column name would be `owner_id` rather than `owner`, since `t.belongs_to` knows the convention we want to follow.
 - A database constraint would be added preventing the column from being blank. If you want to allow this foreign key column to be blank, which is sometimes the case, then you should delete the `null: false` option.
 
If you head over to `app/models/photo.rb`, you'll notice that a `belongs_to :owner` association accessor was automatically added. But wait — that association isn't quite right, is it? Because the other model name is `User`, not `Owner`; we just chose to use a more descriptive foreign key column name than `user_id`.

So, the generator tried to be helpful, but couldn't know that we went off-convention with our foreign key column name. Update the association accessor to be correct:

```ruby
# belongs_to :owner
belongs_to :owner, class_name: "User"
```

Similarly, we need to update the migration file:

```ruby
# t.belongs_to :owner, null: false, foreign_key: true
t.belongs_to :owner, null: false, foreign_key: { to_table: :users }
```

And if we plan to look up photos often by their `owner_id`, or filter the photo table by `owner_id`, it's also a good idea to add an index to the column:

```ruby
t.belongs_to :owner, null: false, foreign_key: { to_table: :users }, index: true
```

Make any other tweaks you think necessary to your migration and, when you're satisfied, `rails db:migrate` and `git commit`.

### Generate other resources

Using the above techniques, generate `Comment`, `FollowRequest`, and `Like` scaffolds. 

```
rails generate scaffold comment author:references photo:references body:text
```

```
rails generate scaffold follow_request recipient:references sender:references status
```

```
rails generate scaffold like fan:references photo:references
```

After each generator, examine the generated migration and model files, make necessary tweaks, `rails db:migrate`, and `git commit`.

### Add association accessors

My next step is to flesh out the business logic in my models, starting with association accessors. (If you're rusty, create an Idea in the [Association Accessor app](https://association-accessors.firstdraft.com/), add our five models, and plan out the association accessor methods you want to add there.)

#### Direct associations

##### belongs_to

Since we used `references` when generating resources, all of the `belongs_to` declarations corresponding to foreign key columns should already be in place in our models; but if not, add them.

##### counter_cache

A handy option to add to `belongs_to` is `:counter_cache`: [read about it](https://guides.rubyonrails.org/association_basics.html#options-for-belongs-to-counter-cache) and add it where you think it appropriate. Fortunately, we already have columns ready and waiting.

(If you need even fancier counter caches in future projects, check out the [counter_culture gem](https://github.com/magnusvk/counter_culture).)

##### has_many

Then, go through and add their other halves — corresponding `has_many` declarations.

For example:

```ruby
class Photo < ApplicationRecord
  has_many :likes # inverse of belongs_to :photo
end

class Like < ApplicationRecord
  belongs_to :photo # inverse of has_many :likes
end
```

##### Sidenote: belongs_to is required by default

In AppDev 1 projects, we changed a default setting of Rails: we made it so that `belongs_to` allows foreign key columns to be blank unless you explicitly add the option `required: true`.

In standard Rails applications, the default is opposite: `belongs_to` adds an automatic validation to foreign key columns enforcing the presence of a valid value unless you explicitly add the option `optional: true`.

So: if you decided to _remove_ the `null: true` database constraint from any of your foreign key columns, then you should also _add_ the `optional: true` option to the corresponding `belongs_to` association accessor.

So remember — if you're ever in the situation of:

 - you're trying to save a record
 - the save is failing
 - you're doing the standard debugging technique of printing out `zebra.errors.full_messages`
 - you're seeing an inexplicable validation error message saying that a foreign key column is blank
 - now you know where the validation is coming from: `belongs_to` adds it automatically
 - so figure out why you're not providing a valid foreign key (usually it is because the parent object failed to save for its own validation reasons)

At this point, I'll stop reminding you to `git commit`. Do it often and create new branches when you think it appropriate.

#### Indirect associations

Next, add any indirect associations that you predict might come in handy. For example:

```ruby
class Photo
  has_many :fans, through: :likes
end
```

### Validations

Go through each model and add any validations that you think might come in handy. You could look at `db/schema.rb`, the ultimate authority on what columns are in your database at any given moment, but wasn't it nice when we had those automatically updated comments in our model files? Check out [the annotate gem](https://github.com/ctran/annotate_models) if you want that functionality.

### Scopes

Are there any `.where` queries that you know you're going to be using over and over on any of your models? If so, there's a wonderful feature to encapsulate them and make them easy to re-use: [ActiveRecord scopes](https://guides.rubyonrails.org/active_record_querying.html#scopes).

In Photogram, we might frequently want to find photos posted within the last week, or order collections of photos from most to least liked:

```ruby
current_user.discover.where(created_at: 1.week.ago...)

current_user.discover.order(likes_count: :desc)
```

We can encapsulate these in scopes:

```ruby
# app/models/photo.rb

scope :past_week, -> { where(created_at: 1.week.ago...) }

scope :by_likes, -> { order(likes_count: :desc) }
```

And then we can call them on any `ActiveRecord::Relation`s of photos:

```ruby
Photo.past_week

current_user.discover.by_likes
```

And, if we're careful to write our scopes such a way that they always return `ActiveRecord::Relation`s, then we can confidently chain them together:

```ruby
current_user.discover.past_week.by_likes
```

Scopes are a very powerful tool. Once you get the hang of using them, you can quickly compose complicated yet intention-revealing queries.

### Enum column type

In `FollowRequest`, we have a column called `status` whose values will be one of only three possibilities: `"pending"`, `"rejected"`, or `"accepted"`. When you find yourself in a situation like this — a column whose possible values are a small fixed list — it's a good candidate to be an `ActiveRecord::Enum`, which will give us a bunch of handy querying and other methods for free.

Sidenote: If you haven't already, it might be a good idea to add a default value of `"pending"` for the `status` column. You will have to generate a new migration and [add it with the `change_column_default` method](https://blog.arkency.com/how-to-add-a-default-value-to-an-existing-column-in-a-rails-migration/); or you can modify the old migration, but then you'll have to destroy your database with `rails db:drop` and then re-create from scratch with `rails db:create db:migrate`.

Now let's make the column an enum:

```ruby
# app/models/follow_request.rb

enum status: { pending: "pending", rejected: "rejected", accepted: "accepted" }
```

Now, we automatically get a bunch of handy methods for each status. We get `?` and `!` instance methods:

```ruby
# assume follow_request is a valid and pending
follow_request.accepted? # => false
follow_request.accepted! # sets status to "accepted" and saves
```

We also get automatic positive and negative scopes:

```ruby
FollowReqest.accepted
current_user.received_follow_requests.not_rejected
```

Exactly what we need!

### Write sample data task

At this point, we've done a lot of work! Generated user accounts and a CRUD interface for our domain, added business logic, while also keeping in mind considerations like database indexes and constraints. And we have yet to even start up our web server!

Still, I usually do one more thing before I still working on the interface: write a `sample_data` rake task. It's _so_ helpful to have data to look at when starting to build out functionality and design the interface; and the data should be varied, there should be a significant amount of it, and it should be easy to reset it whenever things get into a weird state while I am experimenting.

Writing a Ruby program to automate this is a huge productivity boost to the whole team, so it's worth doing it up front. The exercise of doing it also invariably helps shake out bugs in the associations and validations that I just wrote.

Create a file in `lib/tasks` called `dev.rake` and stub out a rake task:

```ruby
task :sample_data do
  p "Creating sample data"
end
```

Make sure it runs with `rails sample_data`. Now, write some Ruby to create some records in each table; however many you think would be useful to you while developing. You can use [the Faker gem](https://github.com/faker-ruby/faker) to produce random values.

In this application, I think a good starting point be a dozen or so users, make them each follow a handful of other users, post a handful or so photos, a handful of likes and comments on each photo, etc. We can go from there.

Notes:

 - When you use `belongs_to` and `has_many`, _a lot_ of methods get defined; [here is a list](https://api.rubyonrails.org/v6.1.3/classes/ActiveRecord/Associations/ClassMethods.html#module-ActiveRecord::Associations::ClassMethods-label-Auto-generated+methods). In particular, methods are defined to make it easier to set foreign keys and add to collections:

    ```ruby
    user = User.first
    user.photos.create(caption: "Hi", image: "https://www.some.url/ofimage.jpg")
    ```

    The above will automatically set the value of the foreign key column, in this case `owner_id`. Handy! There's also a `build` method that is similar to `new`; it will instantiate the object but won't save it yet. `create` instantiates and saves all at once.
 - When writing sample data, if you feel the urge to write logic to enforce some rules about the validity of the data that you're creating, then it might be a sign that you are missing some validations. (This is one is the biggest benefits of going through the exercise of writing the `sample_data` tasks — it reveals missing validations.)

    For example, when writing the Ruby to create a few likes, were you tempted to write a conditional to make sure that the same user didn't like the same photo multiple times? Then you probably forgot a validation:

    ```ruby
    # app/models/like.rb
    
    validates :user_id, uniqueness: { scope: :photo_id, message: "has already liked this photo" }
    ```

    Then, in your `sample_data` task, you need not worry about accidentally creating duplicates; your validation has your back.
 - You can [use scopes in your associations](https://remimercier.com/scoped-active-record-associations/). Combined with indirect associations, you can do some very powerful stuff. As you're writing your sample data task, re-evaluate the associations you wrote. Can you define `has_many` associations that:
     - returns all of a user's accepted sent follow requests?
     - returns a user's `leaders` (recipients of accepted sent follow requests)?
     - returns a user's `feed` (photos posted by a user's leaders)?
     - returns a user's `discover` (photos liked by a user's leaders)?

## Interface

Whew! Once you've finished with your sample data task and all of the debugging of your domain model that inevitably comes of that, it's time to finally start up our web server and take a look at our app!

### Navigation

Let's start by adding a navbar, as usual. Define the root route to `photos#index` and add links to all index pages to the application layout file to give us something to use while developing. Be sure to use `link_to` rather than `<a>`.

Devise provides route helper methods as follows:

 - Sign up: `new_user_registration_path`
 - Sign in: `new_user_session_path`
 - Sign out: `destroy_user_session_path`
 - Edit profile: `edit_user_registration_path`

### Allow additional inputs through Devise strong parameters

As we learned, Rails includes protection against mass assignment attacks by default, and we had to use `params.require().permit()` to whitelist attributes when we switched over to mass assigning in our `create` and `update` actions.

Devise similarly includes mass assignment protections. To whitelist any attributes that we want to allow users to submit through `params`, we need to [allow them through the `devise_parameter_sanitizer`](https://github.com/heartcombo/devise#strong-parameters):

```ruby
class ApplicationController < ActionController::Base
  before_action :configure_permitted_parameters, if: :devise_controller?

  protected

  def configure_permitted_parameters
    devise_parameter_sanitizer.permit(:sign_up, keys: [:username, :private])
    devise_parameter_sanitizer.permit(:update, keys: [:private])
  end
end
```

### Force user sign in

To force users to sign in before they can do anything else, we handwrote a method in AppDev 1 called `force_user_sign_in` and called it with a `before_action`. Happily, Devise provides a method out-of-the-box called `authenticate_user!`. Let's use it in the `ApplicationController`:

```
before_action :authenticate_user!
```

### Interface

Now: improve the interface to look nicer. Make up your own, or take inspiration from [this target](https://pg-industrial-2-final.herokuapp.com/). Note that that target is using Bootstrap version 4; the current version is 5. You can View Source for inspiration but I suggest trying to achieve equivalent results using v5 classes instead.
