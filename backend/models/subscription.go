package models

import "github.com/jinzhu/gorm"

type Subscription struct {
	gorm.Model
	UserID uint  `json:"user_id"`
	TeamID int   `json:"team_id" binding:"required"`
	ChatID int64 `json:"chat_id" default:"0"`
}
