package controllers

import (
	"encoding/json"
	"strconv"

	"github.com/IAmJuniorDev/API-GO/db"
	models "github.com/IAmJuniorDev/API-GO/models"

	"github.com/valyala/fasthttp"
)

// Create Movies (Bulk Insert)
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
