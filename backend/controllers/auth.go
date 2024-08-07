package controllers

import (
	"nba-backend/models"
	"nba-backend/utils"
	"net/http"
	"strings"

	"github.com/gin-gonic/gin"
)

func Login(c *gin.Context) {
	var user models.User
	if err := c.ShouldBindJSON(&user); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	db := utils.GetDB()
	var dbUser models.User
	if err := db.Where("email = ?", user.Email).First(&dbUser).Error; err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid credentials"})
		return
	}

	if !utils.CheckPasswordHash(user.Password, dbUser.Password) {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid credentials"})
		return
	}

	token, _ := utils.GenerateJWT(user.Email)

	c.JSON(http.StatusOK, gin.H{"success": true, "token": token})
}

func Register(c *gin.Context) {
	var user models.User
	if err := c.ShouldBindJSON(&user); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	db := utils.GetDB()
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

	if verified == "" {
		c.JSON(http.StatusForbidden, gin.H{"error": "Forbidden"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"success": true, "email": verified})
}
