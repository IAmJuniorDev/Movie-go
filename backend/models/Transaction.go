package models

type Transaction struct {
	ID       int64  `json:"id" gorm:"primaryKey"`
	Username string `json:username`
}
