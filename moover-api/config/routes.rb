Rails.application.routes.draw do

  namespace :api do
    post 'signup', to: 'auth#signup'
    post 'login', to: 'auth#login'
    
    # Tasks endpoints (public templates)
    resources :tasks, only: [:index, :show] do
      collection do
        get :categories
      end
    end
    
    resources :moves do
      collection do
        get :current
      end
      
      member do
        post :generate_tasks
      end
      
      # Nested resources for moves
      resources :rooms do
        collection do
          get :room_types
        end
      end
      
      resources :user_tasks do
        member do
          patch :complete
          patch :uncomplete
        end
        collection do
          get :summary
        end
      end
    end
  end
  
  get '/api/profile', to: 'api/protected#profile'

  # Define your application routes per the DSL in https://guides.rubyonrails.org/routing.html

  # Reveal health status on /up that returns 200 if the app boots with no exceptions, otherwise 500.
  # Can be used by load balancers and uptime monitors to verify that the app is live.
  get "up" => "rails/health#show", as: :rails_health_check
  # Defines the root path route ("/")
  # root "posts#index"
end
