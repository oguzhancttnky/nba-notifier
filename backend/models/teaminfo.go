package models

import "github.com/jinzhu/gorm"

type TeamInfo struct {
	gorm.Model
	ID           int    `json:"id"`
	Conference   string `json:"conference"`
	Division     string `json:"division"`
	City         string `json:"city"`
	Name         string `json:"name"`
	FullName     string `json:"full_name"`
	Abbreviation string `json:"abbreviation"`
}
