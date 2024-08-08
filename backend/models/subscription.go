package models

import "github.com/jinzhu/gorm"

type Subscription struct {
	gorm.Model
	UserID uint   `json:"userID"`
	Team   string `json:"team" binding:"required"`
	ChatID int64  `json:"chatID" default:"0"`
}
