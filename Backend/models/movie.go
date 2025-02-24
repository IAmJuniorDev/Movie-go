package models

// Movie Model
type Movie struct {
	ID          int64   `json:"id" gorm:"primaryKey"`
	ImdbID      string  `json:"imdbID"`
	Title       string  `json:"title"`
	Year        int     `json:"year"`
	Rating      float64 `json:"rating"`
	IsSuperhero bool    `json:"isSuperhero"`
}

// MoviesPayload for batch creation
type MoviesPayload struct {
	Movies []Movie `json:"movies"`
}
