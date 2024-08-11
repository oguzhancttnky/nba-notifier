package controllers

import (
	"nba-backend/models"
	"nba-backend/utils"
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
)

func GiveUserIDByEmail(c *gin.Context) {
	var user models.User
	email := c.Param("email")
	db := utils.GetDB()
	if err := db.Where("email = ?", email).First(&user).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "User not found"})
		return
	}
	c.JSON(http.StatusOK, gin.H{"id": user.ID})
}

func GiveEmailByUserID(c *gin.Context) {
	var user models.User
	userID := c.Param("userID")
	db := utils.GetDB()
	if err := db.Where("id = ?", userID).First(&user).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "User not found"})
		return
	}
	c.JSON(http.StatusOK, gin.H{"email": user.Email})
}

func GetUserByID(c *gin.Context) {
	var user models.User
	userID := c.Param("userID")
	db := utils.GetDB()
	if err := db.Where("id = ?", userID).First(&user).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "User not found"})
		return
	}
	c.JSON(http.StatusOK, user)
}

func UpdateUserByID(c *gin.Context) {
	type UpdateUserInput struct {
		Email    string `json:"email"`
		Password string `json:"password"`
		ChatID   string `json:"chat_id"`
	}

	var updates UpdateUserInput
	var user models.User
	var chatID int64

	userID := c.Param("userID")
	db := utils.GetDB()

	if err := db.Where("id = ?", userID).First(&user).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "User not found"})
		return
	}

	if err := c.ShouldBindJSON(&updates); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// Check if the email already exists in another user
	if updates.Email != "" {
		var existingUser models.User
		if err := db.Where("email = ? AND id != ?", updates.Email, userID).First(&existingUser).Error; err == nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": "Email already exists"})
			return
		}
	} else {
		updates.Email = user.Email
	}

	// Hash password if provided
	if updates.Password != "" {
		updates.Password, _ = utils.HashPassword(updates.Password)
	} else {
		updates.Password = user.Password
	}

	// Check if the chat ID already exists in another user
	if updates.ChatID != "" {
		var err error
		chatID, err = strconv.ParseInt(updates.ChatID, 10, 64)
		if err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": "Chat ID must be a number"})
			return
		}
		var existingUser models.User
		if err := db.Where("chat_id = ? AND id != ?", chatID, userID).First(&existingUser).Error; err == nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": "Chat ID already exists"})
			return
		}
	} else {
		chatID = user.ChatID
	}

	// Update the user's information
	if err := db.Model(&user).Updates(models.User{Email: updates.Email, Password: updates.Password, ChatID: chatID}).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update user"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"success": true})
}
