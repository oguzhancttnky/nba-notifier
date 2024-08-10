// utils/helpers.go
package utils

import (
	"encoding/json"
	"fmt"
	"io/ioutil"
	"strconv"
	"strings"

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
	data, err := ioutil.ReadAll(c.Request.Body)
	if err != nil {
		return err
	}
	return json.Unmarshal(data, v)
}

func ExtractTeamAndGameID(text string) (int, int, error) {
	parts := strings.Split(text, " ")
	if len(parts) != 3 {
		return 0, 0, fmt.Errorf("invalid number of arguments")
	}

	teamID, err := strconv.Atoi(parts[1])
	if err != nil {
		return 0, 0, fmt.Errorf("invalid team ID")
	}

	if teamID < 1 || teamID > 30 {
		return 0, 0, fmt.Errorf("invalid team ID")
	}

	gameID, err := strconv.Atoi(parts[2])
	if err != nil {
		return 0, 0, fmt.Errorf("invalid game ID")
	}

	return teamID, gameID, nil
}

func ExtractTeamID(text string) (int, error) {
	parts := strings.Split(text, " ")
	if len(parts) != 2 {
		return 0, fmt.Errorf("invalid number of arguments")
	}

	teamID, err := strconv.Atoi(parts[1])
	if err != nil {
		return 0, fmt.Errorf("invalid team ID")
	}

	if teamID < 1 || teamID > 30 {
		return 0, fmt.Errorf("invalid team ID")
	}

	return teamID, nil
}
