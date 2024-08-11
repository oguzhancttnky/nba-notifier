package utils

import (
	"encoding/json"
	"fmt"
	"net/http"
	"os"
)

// GetGames retrieves games for a specific team ID for the current season
func GetGames(teamID string) ([]map[string]interface{}, error) {
	start_date := "2023-10-24"
	end_date := "2024-04-16"
	apiURL := fmt.Sprintf("https://api.balldontlie.io/v1/games?team_ids[]=%s&start_date=%s&end_date=%s", teamID, start_date, end_date)
	req, err := http.NewRequest("GET", apiURL, nil)
	if err != nil {
		return nil, err
	}
	req.Header.Add("Authorization", os.Getenv("NBA_API_TOKEN"))

	client := &http.Client{}
	resp, err := client.Do(req)
	if err != nil {
		return nil, err
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK {
		return nil, fmt.Errorf("Failed to fetch games: %s", resp.Status)
	}

	var result struct {
		Data []map[string]interface{} `json:"data"`
	}
	if err := json.NewDecoder(resp.Body).Decode(&result); err != nil {
		return nil, err
	}

	var games []map[string]interface{}
	for _, game := range result.Data {
		gameInfo := map[string]interface{}{
			"game_id":            game["id"],
			"date":               game["date"],
			"home_team_name":     game["home_team"].(map[string]interface{})["full_name"],
			"visitor_team_name":  game["visitor_team"].(map[string]interface{})["full_name"],
			"home_team_score":    game["home_team_score"],
			"visitor_team_score": game["visitor_team_score"],
		}
		games = append(games, gameInfo)
	}

	return games, nil
}

func GetGame(gameID string) (map[string]interface{}, error) {
	apiURL := fmt.Sprintf("https://api.balldontlie.io/v1/games/%s", gameID)
	req, err := http.NewRequest("GET", apiURL, nil)
	if err != nil {
		return nil, err
	}
	req.Header.Add("Authorization", os.Getenv("NBA_API_TOKEN"))

	client := &http.Client{}
	resp, err := client.Do(req)
	if err != nil {
		return nil, err
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK {
		return nil, fmt.Errorf("Failed to fetch game info: %s", resp.Status)
	}

	var result struct {
		Data map[string]interface{} `json:"data"`
	}
	if err := json.NewDecoder(resp.Body).Decode(&result); err != nil {
		return nil, err
	}

	gameInfo := map[string]interface{}{
		"date":               result.Data["date"],
		"home_team_name":     result.Data["home_team"].(map[string]interface{})["full_name"],
		"visitor_team_name":  result.Data["visitor_team"].(map[string]interface{})["full_name"],
		"home_team_score":    result.Data["home_team_score"],
		"visitor_team_score": result.Data["visitor_team_score"],
	}

	return gameInfo, nil
}

func GetPlayerStats(gameID string) ([]map[string]interface{}, error) {
	apiURL := fmt.Sprintf("https://api.balldontlie.io/v1/stats?game_ids[]=%s", gameID)
	req, err := http.NewRequest("GET", apiURL, nil)
	if err != nil {
		return nil, err
	}
	req.Header.Add("Authorization", os.Getenv("NBA_API_TOKEN"))

	client := &http.Client{}
	resp, err := client.Do(req)
	if err != nil {
		return nil, err
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK {
		return nil, fmt.Errorf("Failed to fetch game info: %s", resp.Status)
	}

	var result struct {
		Data []map[string]interface{} `json:"data"`
	}
	if err := json.NewDecoder(resp.Body).Decode(&result); err != nil {
		return nil, err
	}

	var playerStats []map[string]interface{}
	for _, player := range result.Data {
		playerInfo := map[string]interface{}{
			"min":        player["min"],
			"fgm":        player["fgm"],
			"fga":        player["fga"],
			"fg_pct":     player["fg_pct"],
			"fg3m":       player["fg3m"],
			"fg3a":       player["fg3a"],
			"fg3_pct":    player["fg3_pct"],
			"ftm":        player["ftm"],
			"fta":        player["fta"],
			"ft_pct":     player["ft_pct"],
			"oreb":       player["oreb"],
			"dreb":       player["dreb"],
			"reb":        player["reb"],
			"ast":        player["ast"],
			"stl":        player["stl"],
			"blk":        player["blk"],
			"turnover":   player["turnover"],
			"pf":         player["pf"],
			"pts":        player["pts"],
			"first_name": player["player"].(map[string]interface{})["first_name"],
			"last_name":  player["player"].(map[string]interface{})["last_name"],
			"position":   player["player"].(map[string]interface{})["position"],
		}
		playerStats = append(playerStats, playerInfo)
	}

	return playerStats, nil
}
