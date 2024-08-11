package models

import (
	"time"

	"github.com/jinzhu/gorm"
)

type PasswordReset struct {
	gorm.Model
	Email     string    `json:"email"`
	Token     string    `json:"token"`
	ExpiresAt time.Time `json:"expires_at"`
}
