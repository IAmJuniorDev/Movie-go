package models

// Movie Model
type Movie struct {
	ID            int64   `json:"id" gorm:"primaryKey;autoIncrement"`
	ImdbID        string  `json:"imdbID" gorm:"primaryKey"`
	TitleEN       string  `json:"title_en" gorm:"type:varchar(100)"`
	TitleTH       string  `json:"title_th" gorm:"type:varchar(150)"`
	Year          int     `json:"year"`
	Rating        float64 `json:"rating"`
	MovieType     string  `json:"movie_type" gorm:"type:varchar(25)"`
	MainGenre     string  `json:"main_genre" gorm:"type:varchar(25)"`
	IsSuperhero   bool    `json:"is_superhero"`
	IsFiction     bool    `json:"is_fiction"`
	IsAction      bool    `json:"is_action"`
	IsAnimated    bool    `json:"is_animated"`
	IsThriller    bool    `json:"is_thriller"`
	IsDrama       bool    `json:"is_drama"`
	IsComedy      bool    `json:"is_comedy"`
	IsHorror      bool    `json:"is_horror"`
	IsMystery     bool    `json:"is_mystery"`
	IsCrime       bool    `json:"is_crime"`
	IsAdventure   bool    `json:"is_adventure"`
	IsWar         bool    `json:"is_war"`
	IsRomance     bool    `json:"is_romance"`
	IsFantasy     bool    `json:"is_fantasy"`
	IsFamily      bool    `json:"is_family"`
	IsHistory     bool    `json:"is_history"`
	IsBiography   bool    `json:"is_biography"`
	IsDocumentary bool    `json:"is_documentary"`
	IsWestern     bool    `json:"is_western"`
	IsSport       bool    `json:"is_sport"`
	IsMusical     bool    `json:"is_musical"`
	ImageV        []byte  `json:"image_v" gorm:"type:LONGBLOB"`
	ImageH        []byte  `json:"image_h" gorm:"type:LONGBLOB"`
	Video         string  `json:"video"`
}

// MoviesPayload for batch creation
type MoviesPayload struct {
	Movies []Movie `json:"movies"`
}
