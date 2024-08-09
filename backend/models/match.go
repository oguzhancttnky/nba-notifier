package models

import "github.com/jinzhu/gorm"

type Match struct {
	gorm.Model
	GameInfo GameInfo `json:"game_info"`
	GameID   int64    `json:"game_id"`
	ChatID   int64    `json:"chat_id"`
	Message  string   `json:"message"`
}
