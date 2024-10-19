class TransactionRelatedUser < ApplicationRecord
  belongs_to :user
  belongs_to :transaction_entry
end
