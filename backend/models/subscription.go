package models

import "github.com/jinzhu/gorm"

type Subscription struct {
	gorm.Model
	UserID uint   `json:"userid"`
	Team   string `json:"team" binding:"required"`
}
