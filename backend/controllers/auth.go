package controllers

import (
	"log"
	"nba-backend/models"
	"nba-backend/utils"
	"net/http"
	"strings"
	"time"

	"github.com/gin-gonic/gin"
)

func Login(c *gin.Context) {
	var user models.User
	if err := c.ShouldBindJSON(&user); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	db := utils.GetDB()
	ipAddress := c.ClientIP()
	var loginAttempt models.LoginAttempt

	if err := db.Where("ip_address = ?", ipAddress).First(&loginAttempt).Error; err != nil {
		loginAttempt = models.LoginAttempt{
			IPAddress:   ipAddress,
			Attempts:    1,
			LastAttempt: time.Now(),
		}
		db.Create(&loginAttempt)
	}

	if loginAttempt.BannedUntil != nil && time.Now().Before(*loginAttempt.BannedUntil) {
		c.JSON(http.StatusTooManyRequests, gin.H{"error": "Too many failed attempts. Try again later."})
		return
	}

	// Attempt to find the user in the database
	var dbUser models.User
	if err := db.Where("email = ?", user.Email).First(&dbUser).Error; err != nil {
		utils.TrackFailedLogin(&loginAttempt, db)
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid credentials"})
		return
	}

	// Check if the provided password matches
	if !utils.CheckPasswordHash(user.Password, dbUser.Password) {
		utils.TrackFailedLogin(&loginAttempt, db)
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid credentials"})
		return
	}

	// If the login is successful, reset the login attempts
	utils.ResetLoginAttempts(&loginAttempt, db)

	userID := dbUser.ID
	token, _ := utils.GenerateJWT(userID)

	c.JSON(http.StatusOK, gin.H{"success": true, "userID": userID, "token": token})
}

func Register(c *gin.Context) {

	db := utils.GetDB()
	if db == nil {
		log.Println("Database connection is nil")
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Database connection error"})
		return
	}

	var user models.User
	if err := c.ShouldBindJSON(&user); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	var existingUser models.User
	if err := db.Where("email = ?", user.Email).First(&existingUser).Error; err == nil {
		c.JSON(http.StatusConflict, gin.H{"error": "Email already registered"})
		return
	}

	hashedPassword, err := utils.HashPassword(user.Password)
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

func VerifyToken(c *gin.Context) {
	authHeader := c.GetHeader("Authorization")
	if authHeader == "" {
		c.JSON(http.StatusForbidden, gin.H{"error": "Forbidden"})
		return
	}

	tokenString := strings.Split(authHeader, " ")[1]
	verified, err := utils.VerifyJWT(tokenString)
	if err != nil {
		c.JSON(http.StatusForbidden, gin.H{"error": "Forbidden"})
		return
	}

	if verified == 0 {
		c.JSON(http.StatusForbidden, gin.H{"error": "Forbidden"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"success": true, "userID": verified})
}

// clear login attempts where last attempt is older than 24 hours
func ClearLoginAttempts() {
	db := utils.GetDB()

	if err := db.Where("last_attempt < ?", time.Now().Add(-24*time.Hour)).Unscoped().Delete(&models.LoginAttempt{}).Error; err != nil {
		log.Println("Failed to clear login attempts")
	}
}
