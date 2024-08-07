package models

import (
	"github.com/golang-jwt/jwt/v5"
	"github.com/jinzhu/gorm"
)

type Claim struct {
	gorm.Model
	Email string `json:"email"`
	jwt.RegisteredClaims
}
