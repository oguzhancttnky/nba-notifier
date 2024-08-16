package main

import (
	"log"
	"nba-backend/controllers"
	"nba-backend/middleware"
	"nba-backend/utils"
	"os"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	"github.com/joho/godotenv"
	"github.com/robfig/cron/v3"
)

func main() {
	// Load .env file
	err := godotenv.Load(".env")
	if err != nil {
		log.Fatal("Error loading .env file")
	}
	router := gin.Default()

	// Initialize database
	if err := utils.InitDB(); err != nil {
		log.Fatalf("Failed to initialize database: %v", err)
	}

	// CORS configuration
	router.Use(cors.New(cors.Config{
		AllowOrigins:     []string{"*"},
		AllowMethods:     []string{"GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"},
		AllowHeaders:     []string{"X-Requested-With", "Content-Type", "Authorization"},
		AllowCredentials: true,
	}))

	api_version := os.Getenv("REACT_APP_API_VERSION")

	login_api := api_version + os.Getenv("REACT_APP_LOGIN_API")
	register_api := api_version + os.Getenv("REACT_APP_REGISTER_API")
	forgot_password_send_email_api := api_version + os.Getenv("REACT_APP_FORGOT_PASSWORD_SEND_EMAIL_API")
	reset_password_api := api_version + os.Getenv("REACT_APP_RESET_PASSWORD_API")
	verify_jwt_token_api := api_version + os.Getenv("REACT_APP_VERIFY_JWT_TOKEN_API")

	telegram_message_send_api := api_version + os.Getenv("REACT_APP_TELEGRAM_MESSAGE_SEND_API")
	telegram_message_received_api := api_version + os.Getenv("REACT_APP_TELEGRAM_MESSAGE_RECEIVED_API")

	get_user_by_user_id_api := api_version + os.Getenv("REACT_APP_GET_USER_BY_USER_ID_API")
	update_user_by_user_id_api := api_version + os.Getenv("REACT_APP_UPDATE_USER_BY_USER_ID_API")
	get_subscriptions_by_user_id_api := api_version + os.Getenv("REACT_APP_GET_SUBSCRIPTIONS_BY_USER_ID_API")

	payizone_payment_api := api_version + os.Getenv("REACT_APP_PAYIZONE_PAYMENT_API")
	payizone_callback_api := api_version + os.Getenv("REACT_APP_PAYIZONE_CALLBACK_API")

	subscribe_nba_team_api := api_version + os.Getenv("REACT_APP_SUBSCRIBE_NBA_TEAM_API")
	unsubscribe_nba_team_api := api_version + os.Getenv("REACT_APP_UNSUBSCRIBE_NBA_TEAM_API")

	// Public routes
	// auth
	router.POST(login_api, controllers.Login)
	router.POST(register_api, controllers.Register)
	router.GET(verify_jwt_token_api, controllers.VerifyToken)
	router.POST(forgot_password_send_email_api, controllers.SendResetPasswordEmail)
	router.POST(reset_password_api, controllers.ResetPassword)

	// telegram
	router.POST(telegram_message_send_api, controllers.TelegramMessageSend)
	router.POST(telegram_message_received_api, controllers.TelegramMessageReceived)

	// payizone
	router.POST(payizone_payment_api, controllers.CreatePayment)
	router.POST(payizone_callback_api, controllers.VerifyPayment)

	// Protected routes
	protected := router.Group("/")
	protected.Use(middleware.JWTMiddleware())
	// user
	protected.GET(get_user_by_user_id_api, controllers.GetUserByID)
	protected.PUT(update_user_by_user_id_api, controllers.UpdateUserByID)
	protected.GET(get_subscriptions_by_user_id_api, controllers.GetSubscriptions)

	// nba team subscription
	protected.POST(subscribe_nba_team_api, controllers.Subscribe)
	protected.POST(unsubscribe_nba_team_api, controllers.Unsubscribe)

	c := cron.New()

	// schedule jobs
	c.AddFunc("@every 10m", controllers.ClearOldCommandLogs)
	c.AddFunc("@every 15m", controllers.FetchTodayGames)
	c.AddFunc("@hourly", controllers.ClearOldTokens)
	c.AddFunc("@daily", controllers.CheckPremiumExpired)
	c.AddFunc("@daily", controllers.ClearPlanTypes)

	c.Start()

	defer c.Stop()

	router.Run(":8080")
}
