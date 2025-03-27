package models

import "time"

// Movie Model
type Movie struct {
	ID            int64     `json:"id" gorm:"primaryKey"`
	ImdbID        string    `json:"imdbID"`
	TitleEN       string    `json:"title_en"`
	TitleTH       string    `json:"title_th"`
	Year          int       `json:"year"`
	Rating        float64   `json:"rating"`
	MovieTime     time.Time `json:"movie_time"`
	IsSuperhero   bool      `json:"is_superhero"`
	IsFiction     bool      `json:"is_fiction"`
	IsAction      bool      `json:"is_action"`
	IsAnimated    bool      `json:"is_animated"`
	IsThriller    bool      `json:"is_thriller"`
	IsDrama       bool      `json:"is_drama"`
	IsComedy      bool      `json:"is_comedy"`
	IsHorror      bool      `json:"is_horror"`
	IsMystery     bool      `json:"is_mystery"`
	IsCrime       bool      `json:"is_crime"`
	IsAdventure   bool      `json:"is_adventure"`
	IsWar         bool      `json:"is_war"`
	IsRomance     bool      `json:"is_romance"`
	IsFantasy     bool      `json:"is_fantasy"`
	IsFamily      bool      `json:"is_family"`
	IsHistory     bool      `json:"is_history"`
	IsBiography   bool      `json:"is_biography"`
	IsMusic       bool      `json:"is_music"`
	IsDocumentary bool      `json:"is_documentary"`
	IsWestern     bool      `json:"is_western"`
	IsSport       bool      `json:"is_sport"`
	IsMusical     bool      `json:"is_musical"`
	Image         []byte    `json:"image" gorm:"type:blob"`
}

// MoviesPayload for batch creation
type MoviesPayload struct {
	Movies []Movie `json:"movies"`
}
