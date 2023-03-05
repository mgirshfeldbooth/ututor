class ApplicationController < ActionController::Base
  before_action :authenticate_user!

  def home
    render({ :template => "home/home"})
  end

end
