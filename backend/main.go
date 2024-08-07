package main

import (
	"log"
	"nba-backend/controllers"
	"nba-backend/middleware"
	"nba-backend/models"
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
	db, err := utils.InitDB()
	if err != nil {
		log.Fatalf("failed to connect to database: %v", err)
	}
	defer db.Close()
	db.AutoMigrate(&models.User{}, &models.Subscription{}, &models.Match{})

	// CORS configuration
	router.Use(cors.New(cors.Config{
		AllowOrigins:     []string{"*"},
		AllowMethods:     []string{"GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"},
		AllowHeaders:     []string{"X-Requested-With", "Content-Type", "Authorization"},
		AllowCredentials: true,
	}))

	// Public routes
	router.POST("/api/login", controllers.Login)
	router.POST("/api/register", controllers.Register)
	router.GET("/api/verifytoken", controllers.VerifyToken)
	router.POST("telegram/message/send", controllers.TelegramMessageSend)
	router.POST("/telegram/message/received", controllers.TelegramMessageReceived)

	// Protected routes
	protected := router.Group("/")
	protected.Use(middleware.JWTMiddleware())
	protected.POST("/api/chatID", controllers.SaveChatID)
	protected.POST("/api/subscribe", controllers.Subscribe)
	protected.POST("/api/unsubscribe", controllers.Unsubscribe)
	protected.GET("/api/subscriptions/:userID", controllers.GetSubscriptions)

	go controllers.ScheduleApiRequest(1*time.Minute, controllers.FetchTodayGames)

	router.Run(":8080")
}
