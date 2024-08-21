# NBA Notifier

## Introduction

NBA Notifier provides users daily NBA match results for their subscribed teams via Telegram. User can subscribe, unsubscribe teams in our website or Telegram bot @nbanotifier_bot.

With telegram bot, user can see current season games and player statistics for games of subscribed teams.

User can subscribe 5 teams for free, 10 teams for ₺5/monthly (Premium) and 20 teams for ₺10/monthly (Deluxe).

User who has Premium and Deluxe subscription can see player statistics of opponent team players too.

Used technologies are Typescript React(frontend), Golang(backend) and Postgresql(database).

## Prerequisites

1. Clone this repository:
```console
git clone https://github.com/oguzhancttnky/nba-notifier.git
cd nba-notifier
```
2. Create a Telegram bot to receive messages from user (@nbanotifier_bot). User need to start chat with Telegram bot and take chat id.
3. ngrok tunneling for Telegram webhook
```console
ngrok http 8080
```
Copy ngrok url and setup tunneling
```console
curl https://api.telegram.org/bot<TELEGRAM_BOT_TOKEN>/setWebhook?url=<ngrok_url>/REACT_APP_TELEGRAM_MESSAGE_RECEIVED_ENDP
```

## Running with Docker

1. Set environment file:
nba-notifier/.env

```
DB_HOST=db
DB_PORT=5432
DB_USER=top_user
DB_PASSWORD=password
DB_NAME=nba_notifier

JWT_SECRET_KEY=jwt_secret_key

NBA_API_TOKEN=ball_dont_lie_api_token
TELEGRAM_BOT_TOKEN=telegram_bot_token

HOST_URL=http://localhost:3000
SMTP_EMAIL=smtp_email
SMTP_PASSWORD=smtp_password
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587

PAYIZONE_API_KEY=payizone_api_key
PAYIZONE_API_SECRET=payizone_api_secret
PAYIZONE_CALLBACK_URL=http://localhost:8080/api/v1/payizone/callback

REACT_APP_SERVER_HOST_URL=http://localhost:8080
REACT_APP_API_VERSION=/api/v1

REACT_APP_LOGIN_ENDP=/auth/login
REACT_APP_REGISTER_ENDP=/auth/register
REACT_APP_FORGOT_PASSWORD_SEND_EMAIL_ENDP=/auth/forgot-password/send-email
REACT_APP_RESET_PASSWORD_ENDP=/auth/reset-password/:token 
REACT_APP_VERIFY_JWT_TOKEN_ENDP=/auth/verify-jwt-token

REACT_APP_TELEGRAM_MESSAGE_SEND_ENDP=/telegram/send-message
REACT_APP_TELEGRAM_MESSAGE_RECEIVED_ENDP=/telegram/received-message

REACT_APP_GET_USER_BY_USER_ID_ENDP=/user/:userID                         # /user/:userId
REACT_APP_UPDATE_USER_BY_USER_ID_ENDP=/user/:userID                      # /user/:userId
REACT_APP_GET_SUBSCRIPTIONS_BY_USER_ID_ENDP=/user/subscriptions/:userID  # /user/subscriptions/:userId

REACT_APP_PAYIZONE_PAYMENT_ENDP=/payizone/payment
REACT_APP_PAYIZONE_CALLBACK_ENDP=/payizone/callback

REACT_APP_SUBSCRIBE_NBA_TEAM_ENDP=/subscription/subscribe
REACT_APP_UNSUBSCRIBE_NBA_TEAM_ENDP=/subscription/unsubscribe

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
pnpm install
```
3. Start the frontend server:
```console
pnpm start
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
3. Configure connection settings in environment file and run Postgresql database.
nba-notifier/.env
```
DB_HOST=localhost
DB_USER=postgres
DB_PASSWORD=postgres
DB_NAME=postgres
```
```console
psql -U postgres
```
4. Run the backend server:
```console
go run main.go
```

Frontend running at `http://localhost:3000` and backend api running at `http://localhost:8080`

## Screenshots

Login Page
![Login Page](https://github.com/user-attachments/assets/cebbb753-0115-4a54-89ea-eb5d2ba185ac)

Home Page
![Home Page](https://github.com/user-attachments/assets/1a0d8635-2bd0-4529-99ed-83db25831b05)

Account Page
![Account Page](https://github.com/user-attachments/assets/6d9d8219-d52a-47cc-a941-d799cea4f1a5)

Help Page
![Help Page](https://github.com/user-attachments/assets/bfff2379-e82b-4174-aaa9-ecfee36dd5ad)

Upgrade Page
![Upgrade Page](https://github.com/user-attachments/assets/4649f068-2bb0-46d1-bef2-8a6039f4e46a)

Payment Page
![Payment Page](https://github.com/user-attachments/assets/dd5d7fcd-a910-47e6-8af9-3631890b27d3)

Telegram Bot(@nbanotifier_bot)
![Telegram Bot](https://github.com/user-attachments/assets/2e576d68-9457-4ebc-a9e0-50688a2b29b7)

![Telegram Bot](https://github.com/user-attachments/assets/2ab0cbe9-0491-4e2a-a099-aa94ee9b20b3)

![Telegram Bot](https://github.com/user-attachments/assets/82f21271-5fcf-4830-9c94-7baafc34f83a)

![Telegram Bot](https://github.com/user-attachments/assets/3117837c-8e8c-4bcb-9bee-2941efdddf0b)


