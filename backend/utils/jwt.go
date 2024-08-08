// utils/jwt.go
package utils

import (
	"nba-backend/models"
	"os"
	"time"

	"github.com/golang-jwt/jwt/v5"
)

// GenerateJWT generates a JWT token
func GenerateJWT(userid uint) (string, error) {
	jwtSecretKey := []byte(os.Getenv("SECRET_KEY"))

	expirationTime := time.Now().Add(24 * time.Hour)
	claims := &models.Claim{
		UserID: userid,
		RegisteredClaims: jwt.RegisteredClaims{
			ExpiresAt: jwt.NewNumericDate(expirationTime),
		},
	}

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	return token.SignedString(jwtSecretKey)
}

// VerifyJWT verifies a JWT token
func VerifyJWT(tokenString string) (uint, error) {
	jwtSecretKey := []byte(os.Getenv("SECRET_KEY"))

	claims := &models.Claim{}

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
