package models

import "gorm.io/gorm"

type Match struct {
	gorm.Model
	GameID  int64  `json:"game_id"`
	ChatID  int64  `json:"chat_id"`
	Message string `json:"message"`
}
