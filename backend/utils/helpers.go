// utils/helpers.go
package utils

import (
	"encoding/json"
	"fmt"
	"io"
	"math/rand"
	"nba-backend/models"
	"net/smtp"
	"os"
	"strconv"
	"strings"
	"time"

	"github.com/gin-gonic/gin"
)

// Contains checks if an array contains a string
func Contains(arr [30]string, team string) bool {
	for _, t := range arr {
		if t == team {
			return true
		}
	}
	return false
}

func GetTeamNameByID(teamID int64) string {
	var teamName string
	switch teamID {
	case 1:
		teamName = "Atlanta Hawks"
	case 2:
		teamName = "Boston Celtics"
	case 3:
		teamName = "Brooklyn Nets"
	case 4:
		teamName = "Charlotte Hornets"
	case 5:
		teamName = "Chicago Bulls"
	case 6:
		teamName = "Cleveland Cavaliers"
	case 7:
		teamName = "Dallas Mavericks"
	case 8:
		teamName = "Denver Nuggets"
	case 9:
		teamName = "Detroit Pistons"
	case 10:
		teamName = "Golden State Warriors"
	case 11:
		teamName = "Houston Rockets"
	case 12:
		teamName = "Indiana Pacers"
	case 13:
		teamName = "LA Clippers"
	case 14:
		teamName = "Los Angeles Lakers"
	case 15:
		teamName = "Memphis Grizzlies"
	case 16:
		teamName = "Miami Heat"
	case 17:
		teamName = "Milwaukee Bucks"
	case 18:
		teamName = "Minnesota Timberwolves"
	case 19:
		teamName = "New Orleans Pelicans"
	case 20:
		teamName = "New York Knicks"
	case 21:
		teamName = "Oklahoma City Thunder"
	case 22:
		teamName = "Orlando Magic"
	case 23:
		teamName = "Philadelphia 76ers"
	case 24:
		teamName = "Phoenix Suns"
	case 25:
		teamName = "Portland Trail Blazers"
	case 26:
		teamName = "Sacramento Kings"
	case 27:
		teamName = "San Antonio Spurs"
	case 28:
		teamName = "Toronto Raptors"
	case 29:
		teamName = "Utah Jazz"
	case 30:
		teamName = "Washington Wizards"
	}
	return teamName
}

func ParseJSON(c *gin.Context, v interface{}) error {
	data, err := io.ReadAll(c.Request.Body)
	if err != nil {
		return err
	}
	return json.Unmarshal(data, v)
}

func ExtractGameID(text string) (int, error) {
	parts := strings.Split(text, " ")
	if len(parts) != 2 {
		return 0, fmt.Errorf("Invalid number of arguments")
	}

	gameID, err := strconv.Atoi(parts[1])
	if err != nil {
		return 0, fmt.Errorf("Invalid game ID")
	}

	return gameID, nil
}

func ExtractTeamID(text string) (int, error) {
	parts := strings.Split(text, " ")
	if len(parts) != 2 {
		return 0, fmt.Errorf("Invalid number of arguments")
	}

	teamID, err := strconv.Atoi(parts[1])
	if err != nil {
		return 0, fmt.Errorf("Invalid team ID")
	}

	if teamID < 1 || teamID > 30 {
		return 0, fmt.Errorf("Invalid team ID")
	}

	return teamID, nil
}

func GenerateToken(length int) string {
	charset := "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"
	seededRand := rand.New(rand.NewSource(time.Now().UnixNano()))

	token := make([]byte, length)
	for i := range token {
		token[i] = charset[seededRand.Intn(len(charset))]
	}
	return string(token)
}

func SendResetPasswordEmail(email, token string) error {
	// Set up authentication information.
	auth := smtp.PlainAuth(
		"",
		os.Getenv("SMTP_EMAIL"),
		os.Getenv("SMTP_PASSWORD"),
		os.Getenv("SMTP_HOST"),
	)

	// Compose the email content
	from := os.Getenv("SMTP_EMAIL")
	to := []string{email}
	subject := "Password Reset Request"
	host := os.Getenv("HOST_URL")
	resetLink := fmt.Sprintf("%s/resetpassword?token=%s", host, token)
	body := fmt.Sprintf("Hi,\n\nYou requested to reset your password. Please click the link below to reset your password:\n\n%s\n\nIf you didn't request this, please ignore this email.\n\nThanks.", resetLink)

	// Combine headers and body
	message := []byte(fmt.Sprintf("From: %s\r\nTo: %s\r\nSubject: %s\r\n\r\n%s", from, email, subject, body))

	// Send the email
	err := smtp.SendMail(
		fmt.Sprintf("%s:%s", os.Getenv("SMTP_HOST"), os.Getenv("SMTP_PORT")),
		auth,
		from,
		to,
		message,
	)
	if err != nil {
		return fmt.Errorf("failed to send email: %w", err)
	}

	// Save the reset token to the database
	db := GetDB()
	var reset models.PasswordReset
	reset.Email = email
	reset.Token = token
	reset.ExpiresAt = time.Now().Add(1 * time.Hour)
	db.Create(&reset)

	return nil
}
