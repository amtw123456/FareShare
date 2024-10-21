class AddFieldsToTransactionEntries < ActiveRecord::Migration[7.2]
  def change
    add_column :transaction_entries, :lat, :decimal
    add_column :transaction_entries, :long, :decimal
  end
end
