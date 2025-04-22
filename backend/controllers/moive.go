package controllers

import (
	"encoding/json"
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
	var movie models.Movie
	if err := json.Unmarshal(ctx.PostBody(), &movie); err != nil {
		ctx.SetStatusCode(400)
		ctx.SetBody([]byte("Invalid JSON"))
		return
	}
	movie.ID = old.ID
	db.DB.Save(&movie)
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
	ctx.SetStatusCode(200)
	ctx.SetBody([]byte("Movie deleted"))
}
