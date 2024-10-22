# FareShare
This repository contains a code for a web application for bill splitting

Frontend Tech Stack: Next.js, NextUI, Tailwind
Backend Tech Stack: Ruby on Rails
Database: PostgreSQL

Setup for setting up on your local development environment

# 1. Clone the Repository
Start by cloning the FareShare repository at https://github.com/amtw123456/FareShare:

```bash
git clone https://github.com/amtw123456/FareShare
cd FareShare
```

# 2. Frontend Setup (Next.js, Tailwind, NextUI)
Navigate to the frontend directory:

```bash
cd fareshare-frontend
```

# 3. Install the required Next.js dependencies (Make sure to have Node installed)
Run the following command to install the required dependencies:

```bash
npm install
```

# 4. Set up the environment variables of the Next.js application
Setup a .env file on fareshare-fronted or the root of the Next.js application

```bash
mkdir .env
```

or you can create a .env without using the terminal


Paste this environment variable and the localhost:3000 link so that the Next.js application knows where the API will be coming from

```bash
NEXT_PUBLIC_BACKEND_URL="http://localhost:3000"
```


# 5. Start the Development Server
To start the development server, run:

```bash
npm run dev
```

Note: The frontend application will run on http://localhost:3001 (since I changed the port where the application will be accessible).


# 6. Backend Setup (Ruby on Rails)
Navigate to the fareshare-backend folder of the repository (Make sure you have installed all required programs and applications Ruby requires)

```bash
cd ../fareshare-backend
```

# 7. Install the dependencies of the Ruby on Rails Backend API application 
Once you are in the directory of the backend application installed the dependecies 

```bash
bundle install
```

The bundle install command will install all the dependencies found in the Gemfile such as JWT and Bcrypt

Note: The bundle Gemfile is in the Root directory of the folder of Ruby on Rails application

# 8. Modify the database.yml to connect backend to database its in "config/database.yml"
Once you have found database.yml paste the code below in the database.yml and set the username and password of your postgreSQL local server 

```bash
default: &default
  adapter: postgresql
  encoding: unicode
  pool: 5
  username: postgres # input pgadmin or postgresql username of server database
  password: password # input pgadmin or postgresql password of server database
  host: localhost
  # url: <%= ENV["DATABASE_URL"] %> # this is for render database used .env this is when we will use an online postgresql database
  port: 5432
```

Note that you have to have a postgreSQL application installed and PG admin to be able to a local server of your postgreSQL database

# 9. Create the database and migrate the models
Once you have connected your postgreSQL local server to your ruby on rails application type the following commands to the root directory of your backend application

```bash
rails db:create
rails db:migrate
```

# 10. Run the backend server
Once you have created the database and migrated the models to your local postgresql server you may now run the server

```bash
rails server
```

You may now test the web application make sure to run the backend server and frontend application concurrently to be able to test the application properly

Note: You may use Postman to test the api calls of the ruby on rails application

Another Note: Please feel free to contact me if there are any questions and clarifications regarding the application and the setup




