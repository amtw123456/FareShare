class ApplicationController < ActionController::API
    before_action :authenticate
   
    # skip_before_action :authenticate, only: [:login, :register]

    rescue_from JWT::VerificationError, with: :invalid_token
    rescue_from JWT::DecodeError, with: :decode_error
   
    private
   
    def authenticate
      authorization_header = request.headers['Authorization']
      token = authorization_header.split(" ").last if authorization_header
      decoded_token = JsonWebToken.decode(token)
   
      User.find(decoded_token[:user_id])
    end
   
    def invalid_token
      render json: { invalid_token: 'invalid token' }
    end
   
    def decode_error
      render json: { decode_error: 'invalid token or token has expired' }
    end
  end