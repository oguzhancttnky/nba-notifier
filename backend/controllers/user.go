package controllers

import (
	"nba-backend/models"
	"nba-backend/utils"
	"net/http"
	"strconv"
	"time"

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
		if err := db.Where("chat_id = ?", chatID).First(&existingUser).Error; err == nil {
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

	// Update the chat ID in the subscriptions
	if err := utils.UpdateSubscriptionChatID(db, user.ID, chatID); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update chat ID in subscriptions"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"success": true})
}

func SendResetPasswordEmail(c *gin.Context) {
	type ResetPasswordInput struct {
		Email string `json:"email"`
	}

	var reset ResetPasswordInput
	db := utils.GetDB()

	if err := c.ShouldBindJSON(&reset); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	var user models.User
	if err := db.Where("email = ?", reset.Email).First(&user).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "You are not registered with this email"})
		return
	}

	var resetDb models.PasswordReset
	if err := db.Where("email = ?", reset.Email).First(&resetDb).Error; err == nil {
		expired := time.Now().After(resetDb.ExpiresAt)
		if !expired {
			c.JSON(http.StatusBadRequest, gin.H{"error": "We have already sent you an email. Please check your inbox, or try again later"})
			return
		}
	}

	// Generate token for reset password link
	length := 12
	token := utils.GenerateToken(length)

	// send email with reset password link
	if err := utils.SendResetPasswordEmail(reset.Email, token); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to send email"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"success": true})
}

func ResetPassword(c *gin.Context) {
	token := c.Param("token")
	type ResetPasswordInput struct {
		NewPassword string `json:"new_password"`
	}

	var input ResetPasswordInput

	db := utils.GetDB()

	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// Check if the token is valid and not expired
	var reset models.PasswordReset
	if err := db.Where("token = ? AND expires_at > ?", token, time.Now()).First(&reset).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid or expired token"})
		return
	}

	// Update user's password (hashing it before saving)
	var user models.User
	if err := db.Where("email = ?", reset.Email).First(&user).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "User not found"})
		return
	}

	// Hash the new password and update the user's password in the database
	hashedPassword, _ := utils.HashPassword(input.NewPassword)
	if err := db.Model(&user).Update("password", hashedPassword).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update password"})
		return
	}

	db.Unscoped().Delete(&reset)

	c.JSON(http.StatusOK, gin.H{"success": true, "message": "Password updated successfully"})
}
