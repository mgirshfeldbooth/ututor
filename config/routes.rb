Rails.application.routes.draw do
  resources :attempts
  resources :rounds
  resources :plans
  resources :subjects
  resources :exercises
  devise_for :users
  # For details on the DSL available within this file, see https://guides.rubyonrails.org/routing.html
end
