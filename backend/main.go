package main

import (
	"log"
	"net/http"
	"os"
	"strings"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/golang-jwt/jwt/v5"
	"github.com/gorilla/handlers"
	"github.com/jinzhu/gorm"
	_ "github.com/jinzhu/gorm/dialects/postgres"
	"github.com/joho/godotenv"
	"golang.org/x/crypto/bcrypt"
)

var db *gorm.DB

func main() {
	router := gin.Default()

	// Public route
	router.POST("/api/login", login)
	router.POST("/api/register", register)
	router.GET("/verifytoken", verifyToken)

	// Protected route
	protected := router.Group("/")
	protected.Use(JWTMiddleware())
	protected.POST("/api/subscribe", subscribe)
	protected.POST("/api/unsubscribe", unsubscribe)
	protected.GET("/api/subscriptions/:email", getSubscriptions)

	// .env dosyasını yükle
	err := godotenv.Load(".env")
	if err != nil {
		log.Fatal("Error loading .env file")
	}

	dbHost := os.Getenv("DB_HOST")
	dbPort := os.Getenv("DB_PORT")
	dbUser := os.Getenv("DB_USER")
	dbName := os.Getenv("DB_NAME")
	dbPassword := os.Getenv("DB_PASSWORD")

	db, err = gorm.Open("postgres", "host="+dbHost+" port="+dbPort+" user="+dbUser+" dbname="+dbName+" password="+dbPassword+" sslmode=disable")
	if err != nil {
		log.Fatalf("failed to connect to database: %v", err)
	}
	defer db.Close()

	db.AutoMigrate(&User{}, &Subscription{})

	corsHandler := handlers.CORS(
		handlers.AllowedOrigins([]string{"*"}),
		handlers.AllowedMethods([]string{"GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"}),
		handlers.AllowedHeaders([]string{"X-Requested-With", "Content-Type", "Authorization"}),
		handlers.AllowCredentials(),
	)

	http.ListenAndServe(":8080", corsHandler(router))
}

type User struct {
	gorm.Model
	Email         string         `json:"email" binding:"required" gorm:"unique"`
	Password      string         `json:"-"`
	Subscriptions []Subscription `json:"subscriptions"`
}

type Subscription struct {
	gorm.Model
	Email string `json:"email"`
	Team  string `json:"team" binding:"required"`
}

type Claims struct {
	Email string `json:"email"`
	jwt.RegisteredClaims
}

func hashPassword(password string) (string, error) {
	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(password), bcrypt.DefaultCost)
	if err != nil {
		return "", err
	}
	return string(hashedPassword), nil
}

func GenerateJWT(email string) (string, error) {
	jwtSecretKey := []byte(os.Getenv("SECRET_KEY"))

	expirationTime := time.Now().Add(24 * time.Hour)
	claims := &Claims{
		Email: email,
		RegisteredClaims: jwt.RegisteredClaims{
			ExpiresAt: jwt.NewNumericDate(expirationTime),
		},
	}

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	return token.SignedString(jwtSecretKey)
}

func VerifyJWT(tokenString string) (string, error) {
	jwtSecretKey := []byte(os.Getenv("SECRET_KEY"))

	claims := &Claims{}

	token, err := jwt.ParseWithClaims(tokenString, claims, func(token *jwt.Token) (interface{}, error) {
		return jwtSecretKey, nil
	})

	if err != nil || !token.Valid {
		return "", err
	}

	if claims.ExpiresAt.Time.Before(time.Now()) {
		return "", nil
	}

	return claims.Email, nil
}

func JWTMiddleware() gin.HandlerFunc {
	jwtSecretKey := []byte(os.Getenv("SECRET_KEY"))

	return func(c *gin.Context) {
		authHeader := c.GetHeader("Authorization")
		if authHeader == "" {
			c.JSON(http.StatusForbidden, gin.H{"error": "Forbidden"})
			c.Abort()
			return
		}

		tokenString := strings.Split(authHeader, " ")[1]
		claims := &Claims{}

		token, err := jwt.ParseWithClaims(tokenString, claims, func(token *jwt.Token) (interface{}, error) {
			return jwtSecretKey, nil
		})

		if err != nil || !token.Valid {
			c.JSON(http.StatusForbidden, gin.H{"error": "Forbidden"})
			c.Abort()
			return
		}

		c.Set("email", claims.Email)
		c.Next()
	}
}

func checkPasswordHash(password, hash string) bool {
	err := bcrypt.CompareHashAndPassword([]byte(hash), []byte(password))
	return err == nil
}

func login(c *gin.Context) {
	var user User
	if err := c.ShouldBindJSON(&user); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	var dbUser User
	if err := db.Where("email = ?", user.Email).First(&dbUser).Error; err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid credentials"})
		return
	}

	if !checkPasswordHash(user.Password, dbUser.Password) {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid credentials"})
		return
	}

	token, _ := GenerateJWT(user.Email)

	c.JSON(http.StatusOK, gin.H{"success": true, "token": token})
}

func register(c *gin.Context) {
	var user User
	if err := c.ShouldBindJSON(&user); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	var existingUser User
	if err := db.Where("email = ?", user.Email).First(&existingUser).Error; err == nil {
		c.JSON(http.StatusConflict, gin.H{"error": "Email already registered"})
		return
	}

	hashedPassword, err := hashPassword(user.Password)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to hash password"})
		return
	}
	user.Password = hashedPassword

	if err := db.Create(&user).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"success": true})
}

func verifyToken(c *gin.Context) {
	authHeader := c.GetHeader("Authorization")
	if authHeader == "" {
		c.JSON(http.StatusForbidden, gin.H{"error": "Forbidden"})
		return
	}

	tokenString := strings.Split(authHeader, " ")[1]
	verified, err := VerifyJWT(tokenString)
	if err != nil {
		c.JSON(http.StatusForbidden, gin.H{"error": "Forbidden"})
		return
	}

	if verified == "" {
		c.JSON(http.StatusForbidden, gin.H{"error": "Forbidden"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"success": true, "email": verified})
}

func contains(arr [30]string, team string) bool {
	for _, t := range arr {
		if t == team {
			return true
		}
	}
	return false
}

func subscribe(c *gin.Context) {
	var subscription Subscription
	var teams = [30]string{"Lakers", "Warriors", "Bulls", "Celtics", "Heat", "Nets", "Knicks", "Raptors", "76ers", "Mavericks",
		"Rockets", "Spurs", "Suns", "Jazz", "Nuggets", "Clippers", "Kings", "Grizzlies", "Pelicans", "Blazers", "Timberwolves",
		"Thunder", "Hornets", "Hawks", "Cavaliers", "Pistons", "Pacers", "Bucks", "Wizards", "Magic"}
	if err := c.ShouldBindJSON(&subscription); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	if !contains(teams, subscription.Team) {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid team"})
		return
	}

	var user User
	if err := db.Where("email = ?", subscription.Email).First(&user).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "User not found"})
		return
	}

	// Check if the team is already subscribed
	var existingSubscription Subscription
	if err := db.Where("email = ? AND team = ?", subscription.Email, subscription.Team).First(&existingSubscription).Error; err == nil {
		c.JSON(http.StatusConflict, gin.H{"error": "Already subscribed to this team"})
		return
	}

	var subscriptions []Subscription
	if err := db.Where("email = ?", subscription.Email).Find(&subscriptions).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	if len(subscriptions) >= 5 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Maximum subscription limit reached"})
		return
	}

	// Create the subscription
	if err := db.Create(&subscription).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	// Add subscription to user's Subscriptions
	user.Subscriptions = append(user.Subscriptions, subscription)
	if err := db.Save(&user).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"success": true})
}

func unsubscribe(c *gin.Context) {
	var subscription Subscription
	if err := c.ShouldBindJSON(&subscription); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	var user User
	if err := db.Where("email = ?", subscription.Email).First(&user).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "User not found"})
		return
	}

	if err := db.Where("email = ? AND team = ?", subscription.Email, subscription.Team).Unscoped().Delete(&Subscription{}).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	// Remove subscription from user's Teams
	var newSubscriptions []Subscription
	for _, sub := range user.Subscriptions {
		if sub.Team != subscription.Team {
			newSubscriptions = append(newSubscriptions, sub)
		}
	}
	user.Subscriptions = newSubscriptions

	if err := db.Save(&user).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"success": true})
}

func getSubscriptions(c *gin.Context) {
	email := c.Param("email")

	var user User
	if err := db.Where("email = ?", email).First(&user).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "User not found"})
		return
	}

	var subscriptions []Subscription
	if err := db.Where("email = ?", email).Find(&subscriptions).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	var teamList []string
	for _, sub := range subscriptions {
		teamList = append(teamList, sub.Team)
	}

	c.JSON(http.StatusOK, gin.H{"subscriptions": teamList})
}
