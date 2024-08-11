// utils/db.go
package utils

import (
	"fmt"
	"nba-backend/models"
	"os"

	"github.com/jinzhu/gorm"
	_ "github.com/jinzhu/gorm/dialects/postgres"
)

var db *gorm.DB

// InitDB initializes the database connection
func InitDB() (*gorm.DB, error) {
	dbHost := os.Getenv("DB_HOST")
	dbPort := os.Getenv("DB_PORT")
	dbUser := os.Getenv("DB_USER")
	dbName := os.Getenv("DB_NAME")
	dbPassword := os.Getenv("DB_PASSWORD")

	var err error
	db, err = gorm.Open("postgres", fmt.Sprintf("host=%s port=%s user=%s dbname=%s password=%s sslmode=disable", dbHost, dbPort, dbUser, dbName, dbPassword))
	if err != nil {
		return nil, err
	}

	return db, nil
}

func UpdateUserChatID(db *gorm.DB, userID uint, chatID int64) error {
	return db.Model(&models.User{}).Where("id = ?", userID).Update("chat_id", chatID).Error
}

func UpdateSubscriptionChatID(db *gorm.DB, userID uint, chatID int64) error {
	return db.Model(&models.Subscription{}).Where("user_id = ?", userID).Update("chat_id", chatID).Error
}

func IsSubscribedToTeam(db *gorm.DB, userID uint, teamID int) bool {
	var subscription models.Subscription
	if err := db.Where("user_id = ? AND team_id = ?", userID, teamID).First(&subscription).Error; err != nil {
		return false
	}
	return true
}

func AddSubscription(db *gorm.DB, userID uint, teamID int) error {
	subscription := models.Subscription{
		UserID: userID,
		TeamID: teamID,
	}
	return db.Create(&subscription).Error
}

func HandleSubscriptionLimit(db *gorm.DB, userID uint) error {
	var subscriptions []models.Subscription
	if err := db.Where("user_id = ?", userID).Find(&subscriptions).Error; err != nil {
		return fmt.Errorf("Failed to fetch subscriptions")
	}

	if len(subscriptions) >= 5 {
		return fmt.Errorf("Maximum subscription limit reached")
	}

	return nil
}

func RemoveSubscription(db *gorm.DB, userID uint, teamID int) error {
	return db.Where("user_id = ? AND team_id = ?", userID, teamID).Delete(&models.Subscription{}).Error
}

// GetDB returns the database connection
func GetDB() *gorm.DB {
	return db
}
