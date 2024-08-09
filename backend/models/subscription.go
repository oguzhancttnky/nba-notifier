package models

import "github.com/jinzhu/gorm"

type Subscription struct {
	gorm.Model
	UserID uint   `json:"user_id"`
	Team   string `json:"team" binding:"required"`
	ChatID int64  `json:"chat_id" default:"0"`
}
