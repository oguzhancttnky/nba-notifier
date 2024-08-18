package models

import (
	"time"

	"gorm.io/gorm"
)

type LoginAttempt struct {
	gorm.Model
	IPAddress   string `gorm:"index"`
	Attempts    int    `gorm:"default:0"`
	LastAttempt time.Time
	BannedUntil *time.Time
}
