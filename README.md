# NBA Notifier

NBA Notifier is a notifies users for NBA match results via Telegram. Used technologies are React(frontend), Golang(backend) and Postgresql(database).

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
curl https://api.telegram.org/bot<TELEGRAM_BOT_TOKEN>/setWebhook?url=<ngrok_url>/telegram/message/received
```

## Running with Docker

1. Set environment files:
nba-notifier/frontend/.env
```
REACT_APP_API_URL=http://localhost:8080
```
nba-notifier/backend/.env
```
DB_HOST=db-container
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=postgres
DB_NAME=nba_notifier
JWT_SECRET_KEY=Set a secret key for JWT
TELEGRAM_BOT_TOKEN=Get your telegram bot token
NBA_API_TOKEN=Get your api token from https://www.balldontlie.io/
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
npm start
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
3. Setup and run Postgresql database and configure connection settings in backend environment file.
nba-notifier/frontend/.env
```
REACT_APP_API_URL=http://localhost:8080
```
Example setting up backend environment and running Postgresql database
nba-notifier/backend/.env
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
4. Run the backend server:
```console
go run main.go
```

Frontend running at `http://localhost:3000` and backend api running at `http://localhost:8080`

## Screenshots

Login Page
![Login Page](https://github.com/user-attachments/assets/d1499118-9a1d-4902-b63b-db11586184ad)

Home Page
![Home Page](https://github.com/user-attachments/assets/c085b797-884d-474d-b295-d208aeb25a0f)

Account Page
![Account Page](https://github.com/user-attachments/assets/11d6781c-737f-470c-a1e0-9c4d80de66ae)

Telegram Bot(@nbanotifier_bot)
![Telegram Bot](https://github.com/user-attachments/assets/92a93e4c-b7e7-455e-b996-c9342aa401e4)


