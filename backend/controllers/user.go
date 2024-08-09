package controllers

import (
	"fmt"
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

	if updates.Email == "" {
		updates.Email = user.Email
	}
	if updates.Password != "" {
		updates.Password, _ = utils.HashPassword(updates.Password)
	}
	if updates.Password == "" {
		updates.Password = user.Password
	}

	if updates.ChatID != "" {
		var err error
		chatID, err = strconv.ParseInt(updates.ChatID, 10, 64)
		if err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"Chat ID must be number": err.Error()})
			return
		}
		if err := db.Where("chat_id = ?", chatID).First(&user).Error; err == nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": "Chat ID already exists"})
			return
		}
	} else {
		chatID = user.ChatID
	}

	if err := db.Model(&models.Subscription{}).Where("user_id = ?", userID).Update("chat_id", chatID).Error; err != nil {
		fmt.Printf("Error updating Subscription: %s\n", err.Error())
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	db.Model(&user).Updates(models.User{Email: updates.Email, Password: updates.Password, ChatID: chatID, Subscriptions: user.Subscriptions})
	c.JSON(http.StatusOK, gin.H{"success": true})
}
