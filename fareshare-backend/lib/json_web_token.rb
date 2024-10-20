class JsonWebToken
    JWT_SECRET = 'secret_key'
  
    def self.encode(payload, exp = 12.hours.from_now)
      payload[:exp] = exp.to_i
      JWT.encode(payload, JWT_SECRET)
    end
  
    def self.decode(token)

      body = JWT.decode(token, JWT_SECRET)[0]

      HashWithIndifferentAccess.new(body)

    end
  end
  