package models

import (
	"time"

	"gorm.io/gorm"
)

type ChatBan struct {
	gorm.Model
	ChatID    int64     `json:"chat_id"`
	IsBanned  bool      `json:"is_banned" default:"false"`
	BannedAt  time.Time `json:"banned_at"`
	ExpiresAt time.Time `json:"expires_at"`
}
