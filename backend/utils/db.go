// utils/db.go
package utils

import (
	"fmt"
	"log"
	"nba-backend/models"
	"os"
	"time"

	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

var db *gorm.DB

// InitDB initializes the database connection
func InitDB() error {
	dbHost := os.Getenv("DB_HOST")
	dbPort := os.Getenv("DB_PORT")
	dbUser := os.Getenv("DB_USER")
	dbName := os.Getenv("DB_NAME")
	dbPassword := os.Getenv("DB_PASSWORD")

	dsn := fmt.Sprintf("host=%s port=%s user=%s dbname=%s password=%s sslmode=disable", dbHost, dbPort, dbUser, dbName, dbPassword)
	var err error
	db, err = gorm.Open(postgres.Open(dsn), &gorm.Config{})
	if err != nil {
		return err
	}

	// Log connection check
	if err := db.Raw("SELECT 1").Error; err != nil {
		return fmt.Errorf("failed to ping database: %v", err)
	}

	// Automigrate the schema (optional)
	if err := db.AutoMigrate(&models.User{}, &models.Subscription{}, &models.Match{}, &models.CommandLog{}, &models.ChatBan{}, &models.PasswordReset{}, &models.PlanType{}); err != nil {
		return err
	}

	fmt.Println("Database connection and migration successful.")

	return nil
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
	var user models.User
	if err := db.Preload("Subscriptions").Where("id = ?", userID).First(&user).Error; err != nil {
		return fmt.Errorf("User not found")
	}
	subscriptions := user.Subscriptions
	maxSubscriptions := user.MaxSubscriptions

	if len(subscriptions) >= maxSubscriptions {
		return fmt.Errorf("Upgrade account to subscribe more teams.")
	}

	return nil
}

func RemoveSubscription(db *gorm.DB, userID uint, teamID int) error {
	return db.Where("user_id = ? AND team_id = ?", userID, teamID).Unscoped().Delete(&models.Subscription{}).Error
}

func LogCommand(db *gorm.DB, chatID int64, command string) error {
	cmdLog := models.CommandLog{
		ChatID:    chatID,
		Command:   command,
		Timestamp: time.Now(),
	}
	return db.Create(&cmdLog).Error
}

func IsChatBanned(db *gorm.DB, chatID int64) (bool, error) {
	var ban models.ChatBan
	if err := db.Where("chat_id = ?", chatID).First(&ban).Error; err == nil && ban.IsBanned {
		if time.Now().After(ban.ExpiresAt) {
			// Unban the user after the ban duration expire
			return false, db.Model(&ban).Update("is_banned", false).Error
		}
		return true, nil
	}
	// Check if the user should be banned
	return ShouldBanChat(db, chatID)
}

func ShouldBanChat(db *gorm.DB, chatID int64) (bool, error) {
	var logs []models.CommandLog
	if err := db.Where("chat_id = ?", chatID).Order("timestamp desc").Limit(20).Find(&logs).Error; err != nil {
		return false, err
	}

	if len(logs) < 20 {
		return false, nil
	}

	timeDiff := logs[0].Timestamp.Sub(logs[19].Timestamp)
	if timeDiff <= time.Minute {
		var ban models.ChatBan
		if err := db.Where("chat_id = ?", chatID).First(&ban).Error; err != nil {
			ban = models.ChatBan{
				ChatID:    chatID,
				IsBanned:  true,
				BannedAt:  time.Now(),
				ExpiresAt: time.Now().Add(24 * time.Hour),
			}
			return true, db.Create(&ban).Error
		}
		updateBan := models.ChatBan{
			IsBanned:  true,
			BannedAt:  time.Now(),
			ExpiresAt: time.Now().Add(24 * time.Hour),
		}
		return true, db.Model(&ban).Updates(updateBan).Error
	}

	return false, nil
}

// GetDB returns the database connection
func GetDB() *gorm.DB {
	if db == nil {
		log.Println("Database connection is nil")
	}
	return db
}
