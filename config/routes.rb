Rails.application.routes.draw do
  root "application#home"
  post "/insert_round" => "rounds#create"

  devise_for :users

  resources :attempts
  resources :rounds
  resources :plans
  resources :subjects
  resources :exercises

  # Eventually move routes for our React app here
  namespace :api do
    resources :rounds, only: %i[create]
  end

  # For details on the DSL available within this file, see https://guides.rubyonrails.org/routing.html
end
