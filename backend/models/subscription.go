package models

import "github.com/jinzhu/gorm"

type Subscription struct {
	gorm.Model
	Email string `json:"email"`
	Team  string `json:"team" binding:"required"`
}
