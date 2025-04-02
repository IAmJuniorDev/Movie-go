package models

import "time"

// Movie Model
type User struct {
	ID        int64     `json:"id" gorm:"primaryKey"`
	Username  string    `json:"username" gorm:"unique;not null;type:varchar(50)"`
	Email     string    `json:"email" gorm:"unique;not null;type:varchar(50)"`
	Password  string    `json:"password" gorm:"not null;type:varchar(255)"`
	IsAdmin   bool      `json:"is_admin"`
	TimeStamp time.Time `json:"time_stamp" gorm:"not null"`
}
