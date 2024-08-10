package controllers

import (
	"nba-backend/models"
	"nba-backend/utils"
	"net/http"

	"github.com/gin-gonic/gin"
)

func Subscribe(c *gin.Context) {
	var subscription models.Subscription
	var teams = map[int][2]string{
		1:  {"ATL", "Atlanta Hawks"},
		2:  {"BOS", "Boston Celtics"},
		3:  {"BKN", "Brooklyn Nets"},
		4:  {"CHA", "Charlotte Hornets"},
		5:  {"CHI", "Chicago Bulls"},
		6:  {"CLE", "Cleveland Cavaliers"},
		7:  {"DAL", "Dallas Mavericks"},
		8:  {"DEN", "Denver Nuggets"},
		9:  {"DET", "Detroit Pistons"},
		10: {"GSW", "Golden State Warriors"},
		11: {"HOU", "Houston Rockets"},
		12: {"IND", "Indiana Pacers"},
		13: {"LAC", "LA Clippers"},
		14: {"LAL", "Los Angeles Lakers"},
		15: {"MEM", "Memphis Grizzlies"},
		16: {"MIA", "Miami Heat"},
		17: {"MIL", "Milwaukee Bucks"},
		18: {"MIN", "Minnesota Timberwolves"},
		19: {"NOP", "New Orleans Pelicans"},
		20: {"NYK", "New York Knicks"},
		21: {"OKC", "Oklahoma City Thunder"},
		22: {"ORL", "Orlando Magic"},
		23: {"PHI", "Philadelphia 76ers"},
		24: {"PHX", "Phoenix Suns"},
		25: {"POR", "Portland Trail Blazers"},
		26: {"SAC", "Sacramento Kings"},
		27: {"SAS", "San Antonio Spurs"},
		28: {"TOR", "Toronto Raptors"},
		29: {"UTA", "Utah Jazz"},
		30: {"WAS", "Washington Wizards"},
	}

	if err := c.ShouldBindJSON(&subscription); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	_, valid := teams[subscription.TeamID]
	if !valid {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid team ID"})
		return
	}

	db := utils.GetDB()
	var user models.User
	if err := db.Where("id = ?", subscription.UserID).First(&user).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "User not found"})
		return
	}

	var existingSubscription models.Subscription
	if err := db.Where("user_id = ? AND team_id = ?", subscription.UserID, subscription.TeamID).First(&existingSubscription).Error; err == nil {
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

	if err := db.Model(&subscription).Where("user_id = ? AND team_id = ?", subscription.UserID, subscription.TeamID).Update("chat_id", user.ChatID).Error; err != nil {
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

	if err := db.Where("user_id = ? AND team_id = ?", subscription.UserID, subscription.TeamID).Unscoped().Delete(&models.Subscription{}).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	var newSubscriptions []models.Subscription
	for _, sub := range user.Subscriptions {
		if sub.TeamID != subscription.TeamID {
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

// GetSubscriptions handles fetching the users subscriptions
func GetSubscriptions(c *gin.Context) {
	userID := c.Param("userID")

	db := utils.GetDB()

	var subscriptions []models.Subscription
	if err := db.Where("user_id = ?", userID).Find(&subscriptions).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	var teamList []int
	for _, sub := range subscriptions {
		teamList = append(teamList, sub.TeamID)
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
