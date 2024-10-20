Rails.application.routes.draw do
  resources :transaction_related_users do
    collection do
      get 'transaction/:transaction_entry_id', to: 'transaction_related_users#transaction_related_user_by_transaction', as: 'transaction_related_user_by_transaction'
    end
  end
  resources :transaction_entries do
    collection do
      get 'user/:user_id', to: 'transaction_entries#transactions_by_user', as: 'transactions_by_user'
    end
  end
  resources :users, except: [:create]
  # Define your application routes per the DSL in https://guides.rubyonrails.org/routing.html
  post '/login', to: 'users#login'  # Route for the login action
  post '/register', to: 'users#register'  # Route for the registration action
  get '/search', to: 'users#search'
  

  # Reveal health status on /up that returns 200 if the app boots with no exceptions, otherwise 500.
  # Can be used by load balancers and uptime monitors to verify that the app is live.
  get "up" => "rails/health#show", as: :rails_health_check

  # Defines the root path route ("/")
  # root "posts#index"
end
