package models

import (
	"gorm.io/gorm"
)

type PlanType struct {
	gorm.Model
	UserID           uint   `json:"user_id"`
	Plan             string `json:"plan"`
	Price            int    `json:"price"`
	MaxSubscriptions int    `json:"max_subscriptions"`
	OtherCode        string `json:"other_code"`
}
