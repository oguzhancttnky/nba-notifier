package models

import (
	"time"

	"gorm.io/gorm"
)

type CommandLog struct {
	gorm.Model
	ChatID    int64     `json:"chat_id"`
	Command   string    `json:"command"`
	Timestamp time.Time `json:"timestamp"`
}
