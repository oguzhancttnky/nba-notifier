package controllers

import (
	"bytes"
	"encoding/json"
	"fmt"
	"io/ioutil"
	"nba-backend/models"
	"nba-backend/utils"
	"net/http"
	"os"

	"github.com/gin-gonic/gin"

	_ "github.com/lib/pq"
)

func SaveChatID(c *gin.Context) {
	var telegramChat struct {
		UserID uint  `json:"user_id"`
		ChatID int64 `json:"chat_id"`
	}
	if err := c.ShouldBindJSON(&telegramChat); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	db := utils.GetDB()

	var user models.User
	if err := db.Where("chat_id = ?", telegramChat.ChatID).First(&user).Error; err == nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Chat ID already exists"})
		return
	}

	if err := db.Model(&models.User{}).Where("id = ?", telegramChat.UserID).Update("chat_id", telegramChat.ChatID).Error; err != nil {
		fmt.Printf("Error updating User: %s\n", err.Error())
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	if err := db.Model(&models.Subscription{}).Where("user_id = ?", telegramChat.UserID).Update("chat_id", telegramChat.ChatID).Error; err != nil {
		fmt.Printf("Error updating Subscription: %s\n", err.Error())
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"success": true})
}

func TelegramMessageReceived(c *gin.Context) {
	type Update struct {
		UpdateID int `json:"update_id"`
		Message  struct {
			Text string `json:"text"`
			Chat struct {
				ID int64 `json:"id"`
			} `json:"chat"`
		} `json:"message"`
	}
	var update Update

	// Read and parse the incoming JSON data
	data, err := ioutil.ReadAll(c.Request.Body)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to read request body"})
		return
	}
	if err := json.Unmarshal(data, &update); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Failed to parse JSON"})
		return
	}
	switch update.Message.Text {
	case "/help":
		msg := "Welcome to NBA Notifier Bot!\n\n" + "Available commands:\n" +
			"/help - Show this help message\n" +
			"/chatid - Get your chat ID\n"
		SendTelegramMessage(update.Message.Chat.ID, msg)
	case "/chatid":
		chatID := update.Message.Chat.ID
		msg := fmt.Sprintf("Your chat ID is: %d", chatID)
		SendTelegramMessage(update.Message.Chat.ID, msg)
	default:
		msg := "Invalid command. Use /help to see commands."
		SendTelegramMessage(update.Message.Chat.ID, msg)
	}
	c.JSON(http.StatusOK, gin.H{"message": "Test successful"})
}

func TelegramMessageSend(c *gin.Context) {
	type Message struct {
		ChatID int64  `json:"chat_id"`
		Text   string `json:"text"`
	}
	var message Message
	if err := c.ShouldBindJSON(&message); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	if err := SendTelegramMessage(message.ChatID, message.Text); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"success": true})
}

// Sends a message to the user via the Telegram API
func SendTelegramMessage(chatID int64, text string) error {
	messageURL := fmt.Sprintf("https://api.telegram.org/bot%s/sendMessage", os.Getenv("TELEGRAM_BOT_TOKEN"))

	// Prepare the payload
	payload := map[string]interface{}{
		"chat_id": chatID,
		"text":    text,
	}

	// Convert payload to JSON
	payloadBytes, err := json.Marshal(payload)
	if err != nil {
		return fmt.Errorf("failed to marshal payload: %v", err)
	}

	// Send the request
	resp, err := http.Post(messageURL, "application/json", bytes.NewReader(payloadBytes))
	if err != nil {
		return fmt.Errorf("failed to send message: %v", err)
	}
	defer resp.Body.Close()

	// Check the response
	if resp.StatusCode != http.StatusOK {
		return fmt.Errorf("telegram API returned status %v", resp.Status)
	}

	return nil
}
