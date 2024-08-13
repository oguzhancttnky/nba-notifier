package main

import (
	"log"
	"nba-backend/controllers"
	"nba-backend/middleware"
	"nba-backend/utils"
	"time"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	"github.com/joho/godotenv"
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

	// Public routes
	router.POST("/api/v1/login", controllers.Login)
	router.POST("/api/v1/register", controllers.Register)
	router.GET("/api/v1/verifytoken", controllers.VerifyToken)
	router.POST("/api/v1/telegram/message/send", controllers.TelegramMessageSend)
	router.POST("/api/v1/telegram/message/received", controllers.TelegramMessageReceived)
	router.GET("/api/v1/user/:userID", controllers.GetUserByID)
	router.POST("/api/v1/resetpassword/sendemail", controllers.SendResetPasswordEmail)
	router.POST("/api/v1/resetpassword/:token", controllers.ResetPassword)
	router.POST("/api/v1/payizone/payment", controllers.CreatePayment)
	router.POST("/api/v1/payizone/callback", controllers.VerifyPayment)

	// Protected routes
	protected := router.Group("/")
	protected.Use(middleware.JWTMiddleware())
	protected.POST("/api/v1/subscribe", controllers.Subscribe)
	protected.POST("/api/v1/unsubscribe", controllers.Unsubscribe)
	protected.GET("/api/v1/subscriptions/:userID", controllers.GetSubscriptions)
	protected.PUT("/api/v1/update/user/:userID", controllers.UpdateUserByID)

	go utils.SchedulerJob(10*time.Minute, controllers.FetchTodayGames)
	go utils.SchedulerJob(5*time.Minute, controllers.ClearOldCommandLogs)
	go utils.SchedulerJob(1*time.Hour, controllers.ClearOldTokens)
	go utils.SchedulerJob(24*time.Hour, controllers.CheckPremiumExpired)
	go utils.SchedulerJob(24*time.Hour, controllers.ClearPlanTypes)

	router.Run(":8080")
}
