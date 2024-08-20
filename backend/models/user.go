package models

import (
	"time"

	"gorm.io/gorm"
)

type User struct {
	gorm.Model
	Email            string         `json:"email" binding:"required" gorm:"unique"`
	Password         string         `json:"password"`
	Subscriptions    []Subscription `json:"subscriptions" gorm:"foreignKey:UserID"`
	ChatID           int64          `json:"chat_id" gorm:"default:0"`
	AccountType      string         `json:"account_type" gorm:"default:'Free'"` // Free, Premium, Deluxe
	MaxSubscriptions int            `json:"max_subscriptions" gorm:"default:5"`
	StartsAt         time.Time      `json:"starts_at"`
	ExpiresAt        time.Time      `json:"expires_at"`
	Extended         bool           `json:"extended" gorm:"default:false"` // New field to track if the extension has been applied
}
