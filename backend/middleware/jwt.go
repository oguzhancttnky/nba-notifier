package middleware

import (
	"nba-backend/utils"
	"net/http"
	"strings"

	"github.com/gin-gonic/gin"
)

// JWTMiddleware checks the validity of the JWT token
func JWTMiddleware() gin.HandlerFunc {
	return func(c *gin.Context) {
		authHeader := c.GetHeader("Authorization")
		if authHeader == "" {
			c.JSON(http.StatusForbidden, gin.H{"error": "Forbidden"})
			c.Abort()
			return
		}

		tokenString := strings.Split(authHeader, " ")[1]
		claims, err := utils.VerifyJWT(tokenString)
		if err != nil || claims == 0 {
			c.JSON(http.StatusForbidden, gin.H{"error": "Forbidden"})
			c.Abort()
			return
		}

		c.Set("userid", claims)
		c.Next()
	}
}
