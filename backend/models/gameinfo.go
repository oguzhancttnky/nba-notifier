package models

import "github.com/jinzhu/gorm"

type GameInfo struct {
	gorm.Model
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
