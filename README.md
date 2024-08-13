# NBA Notifier

## Introduction

NBA Notifier is a notifies users daily NBA match results of subscribed teams via Telegram. 
User can subscribe, unsubscribe teams in website or Telegram bot @nbanotifier_bot. 
With telegram bot, user can see current season games and player statistics of games of subscribed teams.
User can subscribe 5 teams for free, 10 teams for $1 monthly (Premium) and 20 teams for $2 monthly (Deluxe).

Used technologies are Typescript React(frontend), Golang(backend) and Postgresql(database).

## Prerequisites

1. Clone this repository:
```console
git clone https://github.com/oguzhancttnky/nba-notifier.git
cd nba-notifier
```
2. I created a Telegram bot to receive messages from user (@nbanotifier_bot). User need to start chat with my Telegram bot and take chat id.
3. ngrok tunneling for Telegram webhook
```console
ngrok http 8080
```
Copy ngrok url and setup tunneling
```console
curl https://api.telegram.org/bot<TELEGRAM_BOT_TOKEN>/setWebhook?url=<ngrok_url>/REACT_APP_TELEGRAM_MESSAGE_RECEIVED_API
```

## Running with Docker

1. Set environment file:
nba-notifier/.env

```
DB_HOST=db-container
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=postgres
DB_NAME=nba_notifier
JWT_SECRET_KEY=Set a secret key for JWT
NBA_API_TOKEN=Get your api token from https://www.balldontlie.io/
TELEGRAM_BOT_TOKEN=Get your telegram bot token

HOST_URL=http://localhost:3000
SMTP_EMAIL=
SMTP_PASSWORD=
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587

Get api key and secret key from Payizone
PAYIZONE_API_KEY=api_key
PAYIZONE_API_SECRET=secret_key
PAYIZONE_CALLBACK_URL=

# API
REACT_APP_SERVER_HOST_URL=http://localhost:8080

RESET_PASSWORD_API=

GET_USER_BY_USER_ID_API=
UPDATE_USER_BY_USER_ID_API=
GET_SUBSCRIPTIONS_BY_USER_ID_API=

REACT_APP_API_VERSION=
REACT_APP_LOGIN_API=
REACT_APP_REGISTER_API=
REACT_APP_FORGOT_PASSWORD_SEND_EMAIL_API=
REACT_APP_RESET_PASSWORD_API=
REACT_APP_VERIFY_JWT_TOKEN_API=

REACT_APP_TELEGRAM_MESSAGE_SEND_API=
REACT_APP_TELEGRAM_MESSAGE_RECEIVED_API=

REACT_APP_GET_USER_BY_USER_ID_API=                      
REACT_APP_UPDATE_USER_BY_USER_ID_API=
REACT_APP_GET_SUBSCRIPTIONS_BY_USER_ID_API=

REACT_APP_PAYIZONE_PAYMENT_API=
REACT_APP_PAYIZONE_CALLBACK_API=

REACT_APP_SUBSCRIBE_NBA_TEAM_API=
REACT_APP_UNSUBSCRIBE_NBA_TEAM_API=

```
2. Build and run three containers (db-container, frontend-container and backend-container):
```console
docker compose up --build
```
## Running Locally
### Frontend

1. Navigate to frontend directory:
```console
cd nba-notifier/frontend
```
2. Install dependencies:
```console
npm install
```
3. Start the frontend server:
```console
npm run start
```
### Backend

1. Navigate to the backend directory:
```console
cd nba-notifier/backend
```
2. Install dependencies:
```console
go mod tidy
```
3. Change .env location in main.go:
```
godotenv.Load(".env") -> godotenv.Load("../.env")
```
4. Setup and run Postgresql database and configure connection settings in backend environment file.
Example setting up environment variables and running Postgresql database
nba-notifier/.env
```
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=postgres
DB_NAME=postgres
```
```console
psql -U postgres
```
5. Run the backend server:
```console
go run main.go
```

Frontend running at `http://localhost:3000` and backend api running at `http://localhost:8080`

## Screenshots

Login Page
![Login Page](https://github.com/user-attachments/assets/f1fbc7cb-c592-4454-b51f-32257ac4407f)

Home Page
![Home Page](https://github.com/user-attachments/assets/bef4521e-8b06-44d6-8cdf-b71fd773eb60)

Account Page
![Account Page](https://github.com/user-attachments/assets/47d7657e-71e5-4ac1-947a-f6113189df3f)

Features Page
![Features Page](https://github.com/user-attachments/assets/6013da1a-3484-4c2c-bb53-ba9ed8155c0a)

Upgrade Page
![Upgrade Page](https://github.com/user-attachments/assets/3e51f9a5-6a73-4a13-8d89-01a17736ef12)

Payment Page
![Payment Page](https://github.com/user-attachments/assets/5dce2710-39be-4f55-ba58-0a434b1a2e61)

Telegram Bot(@nbanotifier_bot)
![Telegram Bot](https://github.com/user-attachments/assets/bd8568b5-3c6b-45eb-b31a-5f666fc659a0)

![Telegram Bot](https://github.com/user-attachments/assets/7d487194-04f6-4af6-b110-b7a3fcee3f06)

![Telegram Bot](https://github.com/user-attachments/assets/329813cf-a14e-41bb-b06d-019151c6317d)

![Telegram Bot](https://github.com/user-attachments/assets/4308d44f-d0cd-4500-8c51-78ce7a40bf97)


