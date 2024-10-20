class TransactionEntriesController < ApplicationController
  before_action :set_transaction_entry, only: %i[ show update destroy ]

  # GET /transaction_entries
  def index
    @transaction_entries = TransactionEntry.all

    render json: @transaction_entries
  end

  # GET /transaction_entries/1
  def show
    render json: @transaction_entry
  end

  # POST /transaction_entries
  def create
    @transaction_entry = TransactionEntry.new(transaction_entry_params)

    if @transaction_entry.save
      render json: @transaction_entry, status: :created, location: @transaction_entry
    else
      render json: @transaction_entry.errors, status: :unprocessable_entity
    end
  end

  # PATCH/PUT /transaction_entries/1
  def update
    if @transaction_entry.update(transaction_entry_params)
      render json: @transaction_entry
    else
      render json: @transaction_entry.errors, status: :unprocessable_entity
    end
  end

  # DELETE /transaction_entries/1
  def destroy
    transaction_entry = TransactionEntry.find(params[:id])

    # Delete associated transaction related users
    transaction_entry.transaction_related_users.destroy_all

    # Now delete the transaction entry
    transaction_entry.destroy
  end

  # GET /transaction_entries/user/:user_id
  def transactions_by_user
    @transactions = TransactionEntry.where(user_id: params[:user_id])

    if @transactions.present?
      render json: @transactions
    else
      render json: { error: "No transactions found for user with ID #{params[:user_id]}" }, status: :not_found
    end
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_transaction_entry
      @transaction_entry = TransactionEntry.find(params[:id])
    end

    # Only allow a list of trusted parameters through.
    def transaction_entry_params
      params.require(:transaction_entry).permit(:amount, :title, :description, :user_id)
    end
end
