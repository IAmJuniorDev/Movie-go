package models

import "time"

// Movie Model
type User struct {
	ID        int64     `json:"id" gorm:"primaryKey"`
	Username  string    `json:"username" gorm:"unique;not null"`
	Password  string    `json:"password" gorm:"not null"`
	IsAdmin   bool      `json:"is_admin"`
	TimeStamp time.Time `json:"time_stamp" gorm:"not null"`
}
