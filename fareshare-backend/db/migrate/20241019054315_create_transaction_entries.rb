class CreateTransactionEntries < ActiveRecord::Migration[7.2]
  def change
    create_table :transaction_entries do |t|
      t.decimal :amount
      t.string :title
      t.string :description
      t.references :user, null: false, foreign_key: true

      t.timestamps
    end
  end
end
