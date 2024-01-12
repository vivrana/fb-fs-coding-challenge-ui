Rails.application.routes.draw do
  # Define your application routes per the DSL in https://guides.rubyonrails.org/routing.html

  # Reveal health status on /up that returns 200 if the app boots with no exceptions, otherwise 500.
  # Can be used by load balancers and uptime monitors to verify that the app is live.
  get "up" => "rails/health#show", as: :rails_health_check
  get "points/balance/:user_id", to: "points#balance"

  post "points/redeem/:user_id", to: "points#redeem"
  post "points/add/:user_id", to: "points#add"

  get "points/transactions/:user_id", to: "points#transactions"

  # Defines the root path route ("/")
  # root "posts#index"
end
