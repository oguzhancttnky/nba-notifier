package models

import "github.com/jinzhu/gorm"

type User struct {
	gorm.Model
	Email         string         `json:"email" binding:"required" gorm:"unique"`
	Password      string         `json:"password"`
	Subscriptions []Subscription `json:"subscriptions"`
}