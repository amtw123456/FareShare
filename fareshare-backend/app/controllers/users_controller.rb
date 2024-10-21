class UsersController < ApplicationController
  before_action :set_user, only: %i[ show update destroy ]

  skip_before_action :authenticate, :only => [:login, :register]

  # GET /users
  def index
    @users = User.all

    render json: @users
  end

  # GET /users/1
  def show
    render json: @user
  end

  def search
    if params[:query].present?
      search_term = "%#{params[:query]}%"
      @users = User.where("email LIKE ?", search_term)
      render json: @users
    else
      render json: { error: "Search query is missing" }, status: :unprocessable_entity
    end
  end

  # POST /users
  def register
    @user = User.new(user_params)

    if @user.save
      render json: @user, status: :created, location: @user
    else
      render json: @user.errors, status: :unprocessable_entity
    end
  end

  def login
    user = User.find_by(email: user_params[:email])  # Find user by email

    if user && user.authenticate(user_params[:password])  # Check if password is correct
      token = JsonWebToken.encode(user_id: user.id)
      expires_at = JsonWebToken.decode(token)[:exp]
 
      render json: { token:, expires_at:, user_id: user.id, email: user.email}, status: :ok
    else
      render json: { error: "Invalid email or password." }, status: :unauthorized
    end
  end

  def find_by_userIds
    # Rails.logger.info("Creating a new user with params: #{params[:ids]}")
    if params[:ids].present?
      # Split the comma-separated string of IDs into an array and convert to integers
      ids = params[:ids].split(',').map(&:to_i)
      @users = User.where(id: ids)

      if @users.any?
        render json: @users
      else
        render json: { error: "No users found with the given IDs." }, status: :not_found
      end
    else
      render json: { error: "No IDs provided." }, status: :unprocessable_entity
    end
  end

  # PATCH/PUT /users/1
  def update
    if @user.update(user_params)
      render json: @user
    else
      render json: @user.errors, status: :unprocessable_entity
    end
  end

  # DELETE /users/1
  def destroy
    @user.destroy!
  end
  

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_user
      @user = User.find(params[:id])
    end

    # Only allow a list of trusted parameters through.
    def user_params
      params.require(:user).permit(:first_name, :last_name, :user_name, :email, :password)
    end
end
