Rails.application.routes.draw do
  root "rounds#index"

  devise_for :users

  resources :attempts
  resources :rounds
  resources :plans
  resources :subjects
  resources :exercises
  # For details on the DSL available within this file, see https://guides.rubyonrails.org/routing.html


end
