class UsersController < ApplicationController
  before_action :set_user, only: %i[ show update destroy ]

  # GET /users
  def index
    @users = User.all

    render json: @users
  end

  # GET /users/1
  def show
    render json: @user
  end

  # POST /users
  def register
    Rails.logger.info("Creating a new user with params: #{user_params}")
    @user = User.new(user_params)

    if @user.save
      Rails.logger.info("User created successfully: #{@user.inspect}")
      render json: @user, status: :created, location: @user
    else
      Rails.logger.error("Failed to create user: #{@user.errors.full_messages}")
      render json: @user.errors, status: :unprocessable_entity
    end
  end

  def login
    user = User.find_by(email: user_params[:email])  # Find user by email

    if user && user.authenticate(user_params[:password])  # Check if password is correct
      render json: { message: "Password is correct." }, status: :ok
    else
      render json: { error: "Invalid email or password." }, status: :unauthorized
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
