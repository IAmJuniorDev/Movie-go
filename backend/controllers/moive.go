package controllers

import (
	"encoding/json"
	"io"
	"strconv"

	"github.com/IAmJuniorDev/API-GO/db"
	models "github.com/IAmJuniorDev/API-GO/models"

	"github.com/valyala/fasthttp"
)

type Request struct {
	Fields []string `json:"fields"`
}

type MovieAdmin struct {
	ImdbID    string  `json:"imdb_id" gorm:"primaryKey"`
	TitleEN   string  `json:"title_en" gorm:"type:varchar(100)"`
	TitleTH   string  `json:"title_th" gorm:"type:varchar(150)"`
	Year      int     `json:"year"`
	Rating    float64 `json:"rating"`
	MovieType string  `json:"movie_type" gorm:"type:varchar(25)"`
	MainGenre string  `json:"main_genre" gorm:"type:varchar(25)"`
}

type MovieImage struct {
	ImdbID string `json:"imdb_id" gorm:"primaryKey"`
	ImageV []byte `json:"image_v" gorm:"type:LONGBLOB"`
	ImageH []byte `json:"image_h" gorm:"type:LONGBLOB"`
}

func CreateMovies(ctx *fasthttp.RequestCtx) {
	var payload models.MoviesPayload
	if err := json.Unmarshal(ctx.PostBody(), &payload); err != nil {
		ctx.SetStatusCode(400)
		ctx.SetBody([]byte("Invalid JSON"))
		return
	}
	db.DB.Create(&payload.Movies)
	ctx.SetStatusCode(201)
	response, _ := json.Marshal(payload)
	ctx.SetBody(response)
}

func CreateMoviesAdmin(ctx *fasthttp.RequestCtx) {
	form, err := ctx.MultipartForm()
	if err != nil {
		ctx.SetStatusCode(400)
		ctx.SetBody([]byte("Invalid multipart/form-data"))
		return
	}
	imdbID := string(form.Value["imdb_id"][0])
	titleEN := string(form.Value["title_en"][0])
	titleTH := string(form.Value["title_th"][0])
	year, _ := strconv.Atoi(string(form.Value["year"][0]))
	rating, _ := strconv.ParseFloat(string(form.Value["rating"][0]), 64)
	movieType := string(form.Value["movie_type"][0])
	mainGenre := string(form.Value["main_genre"][0])
	video := string(form.Value["video"][0])
	parseBool := func(field string) bool {
		if val, ok := form.Value[field]; ok && len(val) > 0 {
			b, _ := strconv.ParseBool(val[0])
			return b
		}
		return false
	}
	var imageVBytes, imageHBytes []byte
	if files := form.File["image_v"]; len(files) > 0 {
		file, _ := files[0].Open()
		defer file.Close()
		imageVBytes, _ = io.ReadAll(file)
	}
	if files := form.File["image_h"]; len(files) > 0 {
		file, _ := files[0].Open()
		defer file.Close()
		imageHBytes, _ = io.ReadAll(file)
	}
	movie := models.Movie{
		ImdbID:        imdbID,
		TitleEN:       titleEN,
		TitleTH:       titleTH,
		Year:          year,
		Rating:        rating,
		MovieType:     movieType,
		MainGenre:     mainGenre,
		Video:         video,
		ImageV:        imageVBytes,
		ImageH:        imageHBytes,
		IsSuperhero:   parseBool("is_superhero"),
		IsFiction:     parseBool("is_fiction"),
		IsAction:      parseBool("is_action"),
		IsAnimated:    parseBool("is_animated"),
		IsThriller:    parseBool("is_thriller"),
		IsDrama:       parseBool("is_drama"),
		IsComedy:      parseBool("is_comedy"),
		IsHorror:      parseBool("is_horror"),
		IsMystery:     parseBool("is_mystery"),
		IsCrime:       parseBool("is_crime"),
		IsAdventure:   parseBool("is_adventure"),
		IsWar:         parseBool("is_war"),
		IsRomance:     parseBool("is_romance"),
		IsFantasy:     parseBool("is_fantasy"),
		IsFamily:      parseBool("is_family"),
		IsHistory:     parseBool("is_history"),
		IsBiography:   parseBool("is_biography"),
		IsDocumentary: parseBool("is_documentary"),
		IsWestern:     parseBool("is_western"),
		IsSport:       parseBool("is_sport"),
		IsMusical:     parseBool("is_musical"),
	}
	var movieAdmin MovieAdmin
	movieAdmin.ImdbID = movie.ImdbID
	movieAdmin.TitleEN = movie.TitleEN
	movieAdmin.TitleTH = movie.TitleTH
	movieAdmin.Year = movie.Year
	movieAdmin.Rating = movie.Rating
	movieAdmin.MainGenre = movie.MainGenre
	movieAdmin.MovieType = movie.MovieType
	db.DB.Create(&movie)
	response, _ := json.Marshal(movieAdmin)
	ctx.SetStatusCode(201)
	ctx.SetBody(response)
}

func GetMovies(ctx *fasthttp.RequestCtx) {
	var movies []models.Movie
	yearParam := string(ctx.URI().QueryArgs().Peek("year"))
	if yearParam != "" {
		year, err := strconv.Atoi(yearParam)
		if err != nil {
			ctx.SetStatusCode(fasthttp.StatusBadRequest)
			ctx.SetBody([]byte("Invalid year parameter"))
			return
		}
		db.DB.Where("year = ?", year).Find(&movies)
	} else {
		db.DB.Find(&movies)
	}
	response, _ := json.Marshal(movies)
	ctx.SetStatusCode(fasthttp.StatusOK)
	ctx.SetBody(response)
}

func GetMoviesAdmin(ctx *fasthttp.RequestCtx) {
	var movie []MovieAdmin
	res := db.DB.Model(&models.Movie{}).
		Select("imdb_id, title_en, title_th, year, rating, movie_type, main_genre").
		Find(&movie)
	if res.Error != nil {
		ctx.SetStatusCode(fasthttp.StatusNotFound)
		ctx.SetBody([]byte("Error fetching movies"))
		return
	}
	response, _ := json.Marshal(movie)
	ctx.SetStatusCode(fasthttp.StatusOK)
	ctx.SetBody(response)
}

func GetMovieImage(ctx *fasthttp.RequestCtx) {
	imdbID := ctx.UserValue("id").(string)
	var movie MovieImage
	res := db.DB.Model(&models.Movie{}).
		Select("imdb_id, image_v, image_h").
		Where("imdb_id = ?", imdbID).
		Find(&movie)
	if res.Error != nil {
		ctx.SetStatusCode(fasthttp.StatusNotFound)
		ctx.SetBody([]byte("Error fetching movies"))
		return
	}
	response, _ := json.Marshal(movie)
	ctx.SetStatusCode(fasthttp.StatusOK)
	ctx.SetBody(response)
}

func GetMovie(ctx *fasthttp.RequestCtx) {
	imdbID := ctx.UserValue("id").(string)
	var movie models.Movie
	if err := db.DB.First(&movie, "imdb_id = ?", imdbID).Error; err != nil {
		ctx.SetStatusCode(fasthttp.StatusNotFound)
		ctx.SetBody([]byte("Movie not found"))
		return
	}
	response, _ := json.Marshal(movie)
	ctx.SetStatusCode(fasthttp.StatusOK)
	ctx.SetBody(response)
}

func UpdateMovie(ctx *fasthttp.RequestCtx) {
	imdbID := ctx.UserValue("id").(string)
	var old models.Movie
	if err := db.DB.First(&old, "imdb_id = ?", imdbID).Error; err != nil {
		ctx.SetStatusCode(404)
		ctx.SetBody([]byte("Movie not found"))
		return
	}
	var movie MovieAdmin
	if err := json.Unmarshal(ctx.PostBody(), &movie); err != nil {
		ctx.SetStatusCode(400)
		ctx.SetBody([]byte("Invalid JSON"))
		return
	}
	if old.ImdbID != movie.ImdbID {
		ctx.SetStatusCode(400)
		ctx.SetBody([]byte("not match ImdbId"))
		return
	}
	old.Year = movie.Year
	old.Rating = movie.Rating
	old.ImdbID = movie.ImdbID
	old.TitleTH = movie.TitleTH
	old.TitleEN = movie.TitleEN
	old.MovieType = movie.MovieType
	old.MainGenre = movie.MainGenre
	db.DB.Save(&old)
	response, _ := json.Marshal(movie)
	ctx.SetStatusCode(200)
	ctx.SetBody(response)
}

func AddPictureIntoMovie(ctx *fasthttp.RequestCtx) {
	imdbID := ctx.UserValue("id").(string)
	var old models.Movie
	if err := db.DB.First(&old, "imdb_id = ?", imdbID).Error; err != nil {
		ctx.SetStatusCode(404)
		ctx.SetBody([]byte("Movie not found"))
		return
	}
	imageVFile, err := ctx.FormFile("image_v")
	if err != nil {
		ctx.SetStatusCode(400)
		ctx.SetBody([]byte("Missing image_v"))
		return
	}
	imageHFile, err := ctx.FormFile("image_h")
	if err != nil {
		ctx.SetStatusCode(400)
		ctx.SetBody([]byte("Missing image_h"))
		return
	}
	imageV, err := imageVFile.Open()
	if err != nil {
		ctx.SetStatusCode(500)
		ctx.SetBody([]byte("Failed to open image_v"))
		return
	}
	defer imageV.Close()
	imageH, err := imageHFile.Open()
	if err != nil {
		ctx.SetStatusCode(500)
		ctx.SetBody([]byte("Failed to open image_h"))
		return
	}
	defer imageH.Close()
	imageVBytes := make([]byte, imageVFile.Size)
	_, err = imageV.Read(imageVBytes)
	if err != nil {
		ctx.SetStatusCode(500)
		ctx.SetBody([]byte("Failed to read image_v"))
		return
	}
	imageHBytes := make([]byte, imageHFile.Size)
	_, err = imageH.Read(imageHBytes)
	if err != nil {
		ctx.SetStatusCode(500)
		ctx.SetBody([]byte("Failed to read image_h"))
		return
	}
	if len(imageVBytes) > 10*1024*1024 || len(imageHBytes) > 10*1024*1024 {
		ctx.SetStatusCode(400)
		ctx.SetBody([]byte("Image size exceeds 10 MB limit"))
		return
	}
	var movie models.Movie
	movie = old
	movie.ImageV = imageVBytes
	movie.ImageH = imageHBytes
	if err := db.DB.Save(&movie).Error; err != nil {
		ctx.SetStatusCode(500)
		ctx.SetBody([]byte("Failed to update movie"))
		return
	}
	response, _ := json.Marshal(movie)
	ctx.SetStatusCode(200)
	ctx.SetBody(response)
}

func DeleteMovie(ctx *fasthttp.RequestCtx) {
	id := ctx.UserValue("id").(string)
	var movie models.Movie
	if err := db.DB.First(&movie, "imdb_id = ?", id).Error; err != nil {
		ctx.SetStatusCode(404)
		ctx.SetBody([]byte("Movie not found"))
		return
	}
	db.DB.Delete(&movie)
	response, _ := json.Marshal(movie)
	ctx.SetStatusCode(200)
	ctx.SetBody(response)
}
