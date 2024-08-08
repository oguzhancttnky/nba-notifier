package models

import (
	"github.com/golang-jwt/jwt/v5"
	"github.com/jinzhu/gorm"
)

type Claim struct {
	gorm.Model
	UserID uint `json:"userID"`
	jwt.RegisteredClaims
}
