class CreateTransactionRelatedUsers < ActiveRecord::Migration[7.2]
  def change
    create_table :transaction_related_users do |t|
      t.decimal :amount
      t.references :user, null: false, foreign_key: true
      t.references :transaction_entry, null: false, foreign_key: true
      t.boolean :paid

      t.timestamps
    end
  end
end
