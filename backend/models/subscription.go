package models

import "gorm.io/gorm"

type Subscription struct {
	gorm.Model
	UserID uint  `json:"user_id"`
	TeamID int   `json:"team_id" binding:"required"`
	ChatID int64 `json:"chat_id" gorm:"default:0"`
}
