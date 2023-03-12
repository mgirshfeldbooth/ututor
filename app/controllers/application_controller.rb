class ApplicationController < ActionController::Base
  before_action :authenticate_user!
  protect_from_forgery with: :null_session
  # The reason this is necessary is that Rails has a built in mechanism to protect against cross site request forgery (CSRF) attacks.
  # By default this sees Rails generate a unique token and validate its authenticity with each POST PUT PATCH DELETE request. 
  # If the token is missing, Rails will throw an exception.
  # However, as we are building a single-page app, we will only have a fresh token upon first render, which means we will need to alter this behavior. 
  # The above code ensures that if no CSRF token is provided, Rails will respond with an empty session, which will prevent any other scripts from using our authenticated session to do bad things

  def home
    @plans = Plan.where(tutor_id: current_user.id)
    render({ :template => "home/home"})
  end

end
