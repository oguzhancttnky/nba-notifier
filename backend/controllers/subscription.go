package controllers

import (
	"nba-backend/models"
	"nba-backend/utils"
	"net/http"

	"github.com/gin-gonic/gin"
)

func Subscribe(c *gin.Context) {
	var subscription models.Subscription
	var teams = [30]string{"Lakers", "Warriors", "Bulls", "Celtics", "Heat", "Nets", "Knicks", "Raptors", "76ers", "Mavericks",
		"Rockets", "Spurs", "Suns", "Jazz", "Nuggets", "Clippers", "Kings", "Grizzlies", "Pelicans", "Blazers", "Timberwolves",
		"Thunder", "Hornets", "Hawks", "Cavaliers", "Pistons", "Pacers", "Bucks", "Wizards", "Magic"}
	if err := c.ShouldBindJSON(&subscription); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	if !utils.Contains(teams, subscription.Team) {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid team"})
		return
	}

	db := utils.GetDB()
	var user models.User
	if err := db.Where("id = ?", subscription.UserID).First(&user).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "User not found"})
		return
	}

	var existingSubscription models.Subscription
	if err := db.Where("user_id = ? AND team = ?", subscription.UserID, subscription.Team).First(&existingSubscription).Error; err == nil {
		c.JSON(http.StatusConflict, gin.H{"error": "Already subscribed to this team"})
		return
	}

	var subscriptions []models.Subscription
	if err := db.Where("user_id = ?", subscription.UserID).Find(&subscriptions).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	if len(subscriptions) >= 5 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Maximum subscription limit reached"})
		return
	}

	if err := db.Create(&subscription).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	if err := db.Model(&subscription).Where("user_id = ? AND team = ?", subscription.UserID, subscription.Team).Update("chat_id", user.ChatID).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	user.Subscriptions = append(user.Subscriptions, subscription)
	if err := db.Save(&user).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"success": true})
}

// Unsubscribe handles unsubscribing from a team
func Unsubscribe(c *gin.Context) {
	var subscription models.Subscription
	if err := c.ShouldBindJSON(&subscription); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	db := utils.GetDB()
	var user models.User
	if err := db.Where("id = ?", subscription.UserID).First(&user).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "User not found"})
		return
	}

	if err := db.Where("user_id = ? AND team = ?", subscription.UserID, subscription.Team).Unscoped().Delete(&models.Subscription{}).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	var newSubscriptions []models.Subscription
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

// GetSubscriptions handles fetching the user's subscriptions
func GetSubscriptions(c *gin.Context) {
	userID := c.Param("userID")

	db := utils.GetDB()

	var subscriptions []models.Subscription
	if err := db.Where("user_id = ?", userID).Find(&subscriptions).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	var teamList []string
	for _, sub := range subscriptions {
		teamList = append(teamList, sub.Team)
	}

	c.JSON(http.StatusOK, gin.H{"subscriptions": teamList})
}

func GetAllSubscriptions(c *gin.Context) {
	db := utils.GetDB()

	var subscriptions []models.Subscription
	if err := db.Find(&subscriptions).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"subscriptions": subscriptions})
}
