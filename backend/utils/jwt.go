// utils/jwt.go
package utils

import (
	"os"
	"time"

	"github.com/golang-jwt/jwt/v5"
)

type Claim struct {
	UserID uint `json:"user_id"`
	jwt.RegisteredClaims
}

// GenerateJWT generates a JWT token
func GenerateJWT(userID uint) (string, error) {
	jwtSecretKey := []byte(os.Getenv("JWT_SECRET_KEY"))

	expirationTime := time.Now().Add(24 * time.Hour)
	claims := &Claim{
		UserID: userID,
		RegisteredClaims: jwt.RegisteredClaims{
			ExpiresAt: jwt.NewNumericDate(expirationTime),
		},
	}

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	return token.SignedString(jwtSecretKey)
}

// VerifyJWT verifies a JWT token
func VerifyJWT(tokenString string) (uint, error) {
	jwtSecretKey := []byte(os.Getenv("JWT_SECRET_KEY"))

	claims := &Claim{}

	token, err := jwt.ParseWithClaims(tokenString, claims, func(token *jwt.Token) (interface{}, error) {
		return jwtSecretKey, nil
	})

	if err != nil || !token.Valid {
		return 0, err
	}

	if claims.ExpiresAt.Time.Before(time.Now()) {
		return 0, nil
	}

	return claims.UserID, nil
}
