package route

import (
	"encoding/json"

	"github.com/IAmJuniorDev/API-GO/db"
	"github.com/IAmJuniorDev/API-GO/models"

	"github.com/valyala/fasthttp"
)

// Create Movies (Bulk Insert)
func CreateMovies(ctx *fasthttp.RequestCtx) {
	var payload models.MoviesPayload
	if err := json.Unmarshal(ctx.PostBody(), &payload); err != nil {
		ctx.SetStatusCode(400)
		ctx.SetBody([]byte(`{"error": "Invalid JSON"}`))
		return
	}
	db.DB.Create(&payload.Movies)
	ctx.SetStatusCode(201)
	response, _ := json.Marshal(payload)
	ctx.SetBody(response)
}

// Get All Movies
func GetMovies(ctx *fasthttp.RequestCtx) {
	var movies []models.Movie
	db.DB.Find(&movies)
	response, _ := json.Marshal(movies)
	ctx.SetStatusCode(200)
	ctx.SetBody(response)
}

// Get Single Movie
func GetMovie(ctx *fasthttp.RequestCtx) {
	id := ctx.UserValue("id").(string)
	var movie models.Movie
	if err := db.DB.First(&movie, id).Error; err != nil {
		ctx.SetStatusCode(404)
		ctx.SetBody([]byte(`{"error": "Movie not found"}`))
		return
	}
	response, _ := json.Marshal(movie)
	ctx.SetStatusCode(200)
	ctx.SetBody(response)
}

// Update Movie
func UpdateMovie(ctx *fasthttp.RequestCtx) {
	id := ctx.UserValue("id").(string)
	var movie models.Movie
	if err := db.DB.First(&movie, id).Error; err != nil {
		ctx.SetStatusCode(404)
		ctx.SetBody([]byte(`{"error": "Movie not found"}`))
		return
	}
	if err := json.Unmarshal(ctx.PostBody(), &movie); err != nil {
		ctx.SetStatusCode(400)
		ctx.SetBody([]byte(`{"error": "Invalid JSON"}`))
		return
	}
	db.DB.Save(&movie)
	response, _ := json.Marshal(movie)
	ctx.SetStatusCode(200)
	ctx.SetBody(response)
}

// Delete Movie
func DeleteMovie(ctx *fasthttp.RequestCtx) {
	id := ctx.UserValue("id").(string)
	var movie models.Movie
	if err := db.DB.First(&movie, id).Error; err != nil {
		ctx.SetStatusCode(404)
		ctx.SetBody([]byte(`{"error": "Movie not found"}`))
		return
	}
	db.DB.Delete(&movie)
	ctx.SetStatusCode(200)
	ctx.SetBody([]byte(`{"message": "Movie deleted"}`))
}
