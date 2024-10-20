class TransactionEntry < ApplicationRecord
  belongs_to :user
  has_many :transaction_related_users, dependent: :destroy
end
