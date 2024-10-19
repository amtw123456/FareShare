class TransactionRelatedUsersController < ApplicationController
  before_action :set_transaction_related_user, only: %i[ show update destroy ]

  # GET /transaction_related_users
  def index
    @transaction_related_users = TransactionRelatedUser.all

    render json: @transaction_related_users
  end

  # GET /transaction_related_users/1
  def show
    render json: @transaction_related_user
  end

  # POST /transaction_related_users
  def create
    @transaction_related_user = TransactionRelatedUser.new(transaction_related_user_params)

    if @transaction_related_user.save
      render json: @transaction_related_user, status: :created, location: @transaction_related_user
    else
      render json: @transaction_related_user.errors, status: :unprocessable_entity
    end
  end

  # PATCH/PUT /transaction_related_users/1
  def update
    if @transaction_related_user.update(transaction_related_user_params)
      render json: @transaction_related_user
    else
      render json: @transaction_related_user.errors, status: :unprocessable_entity
    end
  end

  # DELETE /transaction_related_users/1
  def destroy
    @transaction_related_user.destroy!
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_transaction_related_user
      @transaction_related_user = TransactionRelatedUser.find(params[:id])
    end

    # Only allow a list of trusted parameters through.
    def transaction_related_user_params
      params.require(:transaction_related_user).permit(:amount, :user_id, :transaction_entry_id, :paid)
    end
end
