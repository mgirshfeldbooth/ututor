class ApplicationController < ActionController::Base
  before_action :authenticate_user!

  def home
    @plans = Plan.where(tutor_id: current_user.id)
    render({ :template => "home/home"})
  end

end
