package controllers

import (
	"nba-backend/models"
	"nba-backend/utils"
	"net/http"

	"github.com/gin-gonic/gin"
)

func GiveUserIDByEmail(c *gin.Context) {
	var user models.User
	email := c.Param("email")
	db := utils.GetDB()
	if err := db.Where("email = ?", email).First(&user).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "User not found"})
		return
	}
	c.JSON(http.StatusOK, gin.H{"id": user.ID})
}

func GiveEmailByUserID(c *gin.Context) {
	var user models.User
	userID := c.Param("userID")
	db := utils.GetDB()
	if err := db.Where("id = ?", userID).First(&user).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "User not found"})
		return
	}
	c.JSON(http.StatusOK, gin.H{"email": user.Email})
}
