// cmd/main.go
package main

import (
	"log"
	"nba-backend/controllers"
	"nba-backend/middleware"
	"nba-backend/models"
	"nba-backend/utils"
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/gorilla/handlers"
	"github.com/joho/godotenv"
)

func main() {
	router := gin.Default()

	// Load .env file
	err := godotenv.Load(".env")
	if err != nil {
		log.Fatal("Error loading .env file")
	}

	// Initialize database
	db, err := utils.InitDB()
	if err != nil {
		log.Fatalf("failed to connect to database: %v", err)
	}
	defer db.Close()
	db.AutoMigrate(&models.User{}, &models.Subscription{})

	// Public routes
	router.POST("/api/login", controllers.Login)
	router.POST("/api/register", controllers.Register)
	router.GET("/verifytoken", controllers.VerifyToken)

	// Protected routes
	protected := router.Group("/")
	protected.Use(middleware.JWTMiddleware())
	protected.POST("/api/subscribe", controllers.Subscribe)
	protected.POST("/api/unsubscribe", controllers.Unsubscribe)
	protected.GET("/api/subscriptions/:userid", controllers.GetSubscriptions)

	corsHandler := handlers.CORS(
		handlers.AllowedOrigins([]string{"*"}),
		handlers.AllowedMethods([]string{"GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"}),
		handlers.AllowedHeaders([]string{"X-Requested-With", "Content-Type", "Authorization"}),
		handlers.AllowCredentials(),
	)

	http.ListenAndServe(":8080", corsHandler(router))
}
