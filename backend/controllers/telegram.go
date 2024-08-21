package controllers

import (
	"bytes"
	"encoding/json"
	"fmt"
	"nba-backend/models"
	"nba-backend/utils"
	"net/http"
	"os"
	"strconv"
	"strings"
	"time"

	"github.com/gin-gonic/gin"
	_ "github.com/lib/pq"
)

// TelegramMessageReceived handles incoming messages from the Telegram bot.
func TelegramMessageReceived(c *gin.Context) {
	var update struct {
		UpdateID int `json:"update_id"`
		Message  struct {
			Text string `json:"text"`
			Chat struct {
				ID int64 `json:"id"`
			} `json:"chat"`
		} `json:"message"`
	}

	// Parse the incoming JSON data
	if err := utils.ParseJSON(c, &update); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Failed to parse JSON"})
		return
	}

	db := utils.GetDB()
	chatID := update.Message.Chat.ID
	text := update.Message.Text

	// Log the command
	err := utils.LogCommand(db, chatID, text)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to log command"})
		return
	}

	// Check if the user is banned
	isBanned, err := utils.IsChatBanned(db, chatID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to check ban status"})
		return
	}

	if isBanned {
		c.JSON(http.StatusForbidden, gin.H{"error": "You are banned for spamming commands"})
		SendBannedMessage(chatID)
		return
	}

	switch {
	case text == "/help":
		SendHelpMessage(chatID)
	case text == "/chatid":
		SendChatID(chatID)
	case text == "/allteams":
		SendAllTeams(chatID)
	case text == "/subscriptions":
		SendSubscriptions(chatID)
	case strings.HasPrefix(text, "/subscribe"):
		SubscribeToTeam(chatID, text)
	case strings.HasPrefix(text, "/unsubscribe"):
		UnsubscribeFromTeam(chatID, text)
	case strings.HasPrefix(text, "/games"):
		SendGames(chatID, text)
	case strings.HasPrefix(text, "/playerstats"):
		SendPlayerStats(chatID, text)
	default:
		SendUnknownCommandMessage(chatID)
	}
}

func SendHelpMessage(chatID int64) {
	message := "Welcome to NBA Notifier Bot!\n\n" +
		"Available commands:\n" +
		"/help - Show this help message\n" +
		"/chatid - Get your chat ID\n" +
		"/allteams - List all NBA teams ids\n" +
		"/subscriptions - List your subscriptions\n" +
		"/subscribe <team_id> - Subscribe to a team\n" +
		"/unsubscribe <team_id> - Unsubscribe from a team\n" +
		"/games <team_id> - List current season games for a team\n" +
		"/playerstats <game_id> - Show player stats for a game\n"
	SendTelegramMessage(chatID, message)
}

func SendChatID(chatID int64) {
	message := fmt.Sprintf("Your chat ID is %d", chatID)
	SendTelegramMessage(chatID, message)
}

func SendAllTeams(chatID int64) {
	var message strings.Builder
	message.WriteString("Teams:\n")
	for i := 1; i <= 30; i++ {
		teamName := utils.GetTeamNameByID(int64(i))
		message.WriteString(fmt.Sprintf("%s ID: %d\n", teamName, i))
	}
	SendTelegramMessage(chatID, message.String())
}

func SendSubscriptions(chatID int64) {
	db := utils.GetDB()
	var user models.User
	if err := db.Where("chat_id = ?", chatID).First(&user).Error; err != nil {
		SendTelegramMessage(chatID, "You are not subscribed to any teams.")
		return
	}

	var subscriptions []models.Subscription
	if err := db.Where("user_id = ?", user.ID).Find(&subscriptions).Error; err != nil {
		SendTelegramMessage(chatID, "Failed to fetch subscriptions.")
		return
	}

	var message strings.Builder
	message.WriteString("Your subscriptions:\n")
	for _, sub := range subscriptions {
		teamName := utils.GetTeamNameByID(int64(sub.TeamID))
		message.WriteString(fmt.Sprintf("%s ID: %d\n", teamName, sub.TeamID))
	}
	SendTelegramMessage(chatID, message.String())
}

func SubscribeToTeam(chatID int64, text string) {
	teamID, err := utils.ExtractTeamID(text)
	if err != nil {
		SendTelegramMessage(chatID, "Invalid command. Type /help for a list of available commands.")
		return
	}

	db := utils.GetDB()
	var user models.User
	if err := db.Where("chat_id = ?", chatID).First(&user).Error; err != nil {
		SendTelegramMessage(chatID, "You are not subscribed to any teams.")
		return
	}

	if utils.IsSubscribedToTeam(db, user.ID, teamID) {
		SendTelegramMessage(chatID, "You are already subscribed to this team.")
		return
	}

	if err := utils.HandleSubscriptionLimit(db, user.ID); err != nil {
		SendTelegramMessage(chatID, err.Error())
		return
	}

	if err := utils.AddSubscription(db, user.ID, teamID); err != nil {
		SendTelegramMessage(chatID, "Failed to create subscription.")
		return
	}

	message := fmt.Sprintf("Subscribed to team %d.", teamID)
	SendTelegramMessage(chatID, message)
}

func UnsubscribeFromTeam(chatID int64, text string) {
	teamID, err := utils.ExtractTeamID(text)
	if err != nil {
		SendTelegramMessage(chatID, "Invalid command. Type /help for a list of available commands.")
		return
	}

	db := utils.GetDB()
	var user models.User
	if err := db.Where("chat_id = ?", chatID).First(&user).Error; err != nil {
		SendTelegramMessage(chatID, "You are not subscribed to any teams.")
		return
	}

	if !utils.IsSubscribedToTeam(db, user.ID, teamID) {
		SendTelegramMessage(chatID, "You are not subscribed to this team.")
		return
	}

	if err := utils.RemoveSubscription(db, user.ID, teamID); err != nil {
		SendTelegramMessage(chatID, err.Error())
		return
	}

	message := fmt.Sprintf("Unsubscribed from team %d.", teamID)
	SendTelegramMessage(chatID, message)
}

func SendGames(chatID int64, text string) {
	teamID, err := utils.ExtractTeamID(text)
	if err != nil {
		SendTelegramMessage(chatID, "Invalid command. Type /help for a list of available commands.")
		return
	}

	db := utils.GetDB()
	var user models.User
	if err := db.Where("chat_id = ?", chatID).First(&user).Error; err != nil {
		SendTelegramMessage(chatID, "You are not subscribed to any teams.")
		return
	}

	if !utils.IsSubscribedToTeam(db, user.ID, teamID) {
		SendTelegramMessage(chatID, "You are not subscribed to this team.")
		return
	}

	games, err := utils.GetGames(strconv.Itoa(teamID))
	if err != nil {
		SendTelegramMessage(chatID, "Failed to fetch games.")
		return
	}

	var message strings.Builder
	message.WriteString("Current seasons games:\n")
	for _, game := range games {
		message.WriteString(fmt.Sprintf("\n%s\n%s-%d %s-%d\nGame ID: %d\n",
			game["date"],
			game["home_team_abbr"], int(game["home_team_score"].(float64)),
			game["visitor_team_abbr"], int(game["visitor_team_score"].(float64)),
			int(game["game_id"].(float64)),
		))
	}
	SendTelegramMessage(chatID, message.String())
}

func SendPlayerStats(chatID int64, text string) {
	gameID, err := utils.ExtractGameID(text)
	if err != nil {
		SendTelegramMessage(chatID, "Invalid command. Type /help for a list of available commands.")
		return
	}

	db := utils.GetDB()
	var user models.User
	if err := db.Where("chat_id = ?", chatID).First(&user).Error; err != nil {
		SendTelegramMessage(chatID, "You are not subscribed to any teams.")
		return
	}

	game, err := utils.GetGame(strconv.Itoa(gameID))
	if err != nil {
		SendTelegramMessage(chatID, "Failed to fetch game.")
		return
	}

	if !utils.IsSubscribedToTeam(db, user.ID, int(game["home_team_id"].(float64))) && !utils.IsSubscribedToTeam(db, user.ID, int(game["visitor_team_id"].(float64))) {
		SendTelegramMessage(chatID, "Game does not involve any of your subscribed teams.")
		return
	}

	var teamID int
	if utils.IsSubscribedToTeam(db, user.ID, int(game["home_team_id"].(float64))) {
		teamID = int(game["home_team_id"].(float64))
	} else {
		teamID = int(game["visitor_team_id"].(float64))
	}

	stats, err := utils.GetPlayerStats(db, user.ID, teamID, strconv.Itoa(gameID))
	if err != nil {
		SendTelegramMessage(chatID, "Failed to fetch player stats.")
		return
	}

	var message strings.Builder
	message.WriteString(fmt.Sprintf("%s\n%s-%d %s-%d\n",
		game["date"],
		game["home_team_abbr"], int(game["home_team_score"].(float64)),
		game["visitor_team_abbr"], int(game["visitor_team_score"].(float64))))
	message.WriteString("\nPlayer stats:")
	for _, stat := range stats {
		field_goal_percentage := stat["fg_pct"].(float64) * 100

		formatted_fg_pct := fmt.Sprintf("%0.2f", field_goal_percentage)
		if field_goal_percentage == float64(int(field_goal_percentage)) {
			formatted_fg_pct = fmt.Sprintf("%d", int(field_goal_percentage))
		}
		message.WriteString(fmt.Sprintf("\n%s %s\nPts: %d\nReb: %d\nAst: %d\nStl: %d\nBlk: %d\nTurnover: %d\nFouls: %d\nMin: %s\nFG%%: %s\n",
			stat["first_name"], stat["last_name"],
			int(stat["pts"].(float64)),
			int(stat["reb"].(float64)),
			int(stat["ast"].(float64)),
			int(stat["stl"].(float64)),
			int(stat["blk"].(float64)),
			int(stat["turnover"].(float64)),
			int(stat["pf"].(float64)),
			stat["min"],
			formatted_fg_pct),
		)
	}
	SendTelegramMessage(chatID, message.String())
}

func SendUnknownCommandMessage(chatID int64) {
	SendTelegramMessage(chatID, "Unknown command. Type /help for a list of available commands.")
}

func SendBannedMessage(chatID int64) {
	SendTelegramMessage(chatID, "You are banned 24 hours for spamming commands.")
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

	SendTelegramMessage(message.ChatID, message.Text)

	c.JSON(http.StatusOK, gin.H{"success": true})
}

func SendTelegramMessage(chatID int64, text string) error {
	messageURL := fmt.Sprintf("https://api.telegram.org/bot%s/sendMessage", os.Getenv("TELEGRAM_BOT_TOKEN"))
	payload := map[string]interface{}{
		"chat_id": chatID,
		"text":    text,
	}
	payloadBytes, err := json.Marshal(payload)
	if err != nil {
		return fmt.Errorf("Failed to marshal payload: %v", err)
	}
	resp, err := http.Post(messageURL, "application/json", bytes.NewReader(payloadBytes))
	if err != nil {
		return fmt.Errorf("Failed to send message: %v", err)
	}
	defer resp.Body.Close()
	if resp.StatusCode != http.StatusOK {
		return fmt.Errorf("Telegram API returned status %v", resp.Status)
	}

	return nil
}

func ClearOldCommandLogs() {
	db := utils.GetDB()
	threshold := time.Now().Add(-5 * time.Minute)
	db.Where("timestamp < ?", threshold).Unscoped().Delete(&models.CommandLog{})
}

func ClearOldTokens() {
	db := utils.GetDB()
	threshold := time.Now().Add(-1 * time.Hour)
	db.Where("expires_at < ?", threshold).Unscoped().Delete(&models.PasswordReset{})
}
