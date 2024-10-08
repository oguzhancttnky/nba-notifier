package controllers

import (
	"encoding/json"
	"fmt"
	"io"
	"nba-backend/models"
	"nba-backend/utils"
	"net/http"
	"os"
	"strings"
	"time"
)

type TeamInfo struct {
	ID           int    `json:"id"`
	Conference   string `json:"conference"`
	Division     string `json:"division"`
	City         string `json:"city"`
	Name         string `json:"name"`
	FullName     string `json:"full_name"`
	Abbreviation string `json:"abbreviation"`
}

type GameInfo struct {
	ID               int64    `json:"id"`
	Date             string   `json:"date"`
	Season           int      `json:"season"`
	Status           string   `json:"status"`
	Period           int      `json:"period"`
	Time             string   `json:"time"`
	Postseason       bool     `json:"postseason"`
	HomeTeamScore    int      `json:"home_team_score"`
	VisitorTeamScore int      `json:"visitor_team_score"`
	HomeTeam         TeamInfo `json:"home_team"`
	VisitorTeam      TeamInfo `json:"visitor_team"`
}
type ApiResponse struct {
	Data []GameInfo `json:"data"`
	Meta struct {
		PerPage int `json:"per_page"`
	} `json:"meta"`
}

func FetchTodayGames() {
	date := strings.Split(time.Now().String(), " ")[0]
	db := utils.GetDB()
	url := fmt.Sprintf("https://api.balldontlie.io/v1/games?dates[]=%s", date)
	client := http.Client{}
	req, err := http.NewRequest("GET", url, nil)
	if err != nil {
		fmt.Println("Error creating request:", err)
		return
	}

	req.Header = http.Header{
		"Host":          {"https://api.balldontlie.io/v1"},
		"Authorization": {os.Getenv("NBA_API_TOKEN")},
	}

	res, err := client.Do(req)
	if err != nil {
		fmt.Println("Error fetching data:", err)
		return
	}
	defer res.Body.Close()

	if res.StatusCode == http.StatusOK {
		// Read the response body
		bodyBytes, err := io.ReadAll(res.Body)
		if err != nil {
			fmt.Println("Error reading response body:", err)
			return
		}

		// Unmarshal the response body into ApiResponse struct
		var apiResponse ApiResponse
		err = json.Unmarshal(bodyBytes, &apiResponse)
		if err != nil {
			fmt.Println("Error unmarshaling JSON:", err)
			return
		}

		// Print the games
		for _, game := range apiResponse.Data {
			if game.Status == "Final" {
				subscriptions := []models.Subscription{}
				db.Where("team = ?", game.HomeTeam.Name).Or("team = ?", game.VisitorTeam.Name).Find(&subscriptions)
				// Check if same game id and chat id in database
				// If not send message and save it to database
				if len(subscriptions) == 0 {
					continue
				}

				for _, subscription := range subscriptions {
					if db.Where("game_id = ? AND chat_id = ?", game.ID, subscription.ChatID).Find(&models.Match{}).RowsAffected > 0 {
						continue
					}
					if subscription.ChatID == 0 {
						fmt.Println("ChatID is not set for user:", subscription.UserID)
						continue
					}
					message := fmt.Sprintf("Game Between %s and %s is finished\nHome team: %s, Score: %d\nVisitor team: %s, Score: %d\n", game.HomeTeam.Name, game.VisitorTeam.Name, game.HomeTeam.Name, game.HomeTeamScore, game.VisitorTeam.Name, game.VisitorTeamScore)
					if game.HomeTeamScore > game.VisitorTeamScore {
						message += fmt.Sprintf("Winner: %s\n", game.HomeTeam.Name)
					} else {
						message += fmt.Sprintf("Winner: %s\n", game.VisitorTeam.Name)
					}
					SendTelegramMessage(subscription.ChatID, message)
					db.Create(&models.Match{GameID: game.ID, Message: message, ChatID: subscription.ChatID})
				}
			}
		}
	} else {
		fmt.Println("Failed to fetch data. Status code:", res.StatusCode)
	}
}
