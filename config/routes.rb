
Rails.application.routes.draw do
  root to: "static_pages#index"

  get "developers", to: "static_pages#developers"

  namespace :api, defaults: { format: :json } do
    resources :usages,          only: [:index]
    resources :hourly_usages,   only: [:index]
    resources :products,        only: [:index]

    get "list_account_ids", to: "usages#account_ids"
    get "list_all_usages", to: "usages#all"
  end
end
