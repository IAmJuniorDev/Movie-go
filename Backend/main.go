package main

import (
	"database/sql"
	"log"
	"net/http"
	"strconv"

	"github.com/labstack/echo/v4"
	_ "github.com/proullon/ramsql/driver"
)

type Movie struct {
	ID          int64   `json:"id"`
	ImdbID      string  `json:"imdbID"`
	Title       string  `json:"title"`
	Year        int     `json:"year"`
	Rating      float64 `json:"rating"`
	IsSuperhero bool    `json:"isSuperhero"`
}

type MoviesPayload struct {
	Movies []Movie `json:"movies"`
}

var db *sql.DB

func connect() {
	var err error
	db, err = sql.Open("ramsql", "goimdb")
	if err != nil {
		log.Fatalf("Failed to open database: %v", err)
	}
	if err = db.Ping(); err != nil {
		log.Fatalf("Failed to ping database: %v", err)
	}
	log.Println("Database connected successfully")
}

func createMovieHandler(c echo.Context) error {
	var payload MoviesPayload
	err := c.Bind(&payload)
	if err != nil {
		return c.JSON(http.StatusBadRequest, err.Error())
	}
	stmt, err := db.Prepare("INSERT INTO goimdb (imdbID, title, year, rating, isSuperhero) VALUES (?, ?, ?, ?, ?)")
	if err != nil {
		return c.JSON(http.StatusInternalServerError, err.Error())
	}
	defer stmt.Close()
	for _, movie := range payload.Movies {
		_, err := stmt.Exec(movie.ImdbID, movie.Title, movie.Year, movie.Rating, movie.IsSuperhero)
		if err != nil {
			return c.JSON(http.StatusInternalServerError, err.Error())
		}
	}
	return c.JSON(http.StatusCreated, payload)
}

func getAllMoviesHandler(c echo.Context) error {
	y := c.QueryParam("year")
	if y != "" {
		year, err := strconv.Atoi(y)
		if err != nil {
			return c.JSON(http.StatusBadRequest, err.Error())
		}
		rows, err := db.Query("SELECT * FROM goimdb WHERE year = ?", year)
		if err != nil {
			return c.JSON(http.StatusInternalServerError, err.Error())
		}
		defer rows.Close()
		movies := []Movie{}
		for rows.Next() {
			m := Movie{}
			err := rows.Scan(&m.ID, &m.ImdbID, &m.Title, &m.Year, &m.Rating, &m.IsSuperhero)
			if err != nil {
				return c.JSON(http.StatusInternalServerError, err.Error())
			}
			movies = append(movies, m)
		}
		return c.JSON(http.StatusOK, movies)
	}
	rows, err := db.Query("SELECT * FROM goimdb")
	if err != nil {
		return c.JSON(http.StatusInternalServerError, err.Error())
	}
	defer rows.Close()
	movies := []Movie{}
	for rows.Next() {
		m := Movie{}
		err := rows.Scan(&m.ID, &m.ImdbID, &m.Title, &m.Year, &m.Rating, &m.IsSuperhero)
		if err != nil {
			return c.JSON(http.StatusInternalServerError, err.Error())
		}
		movies = append(movies, m)
	}
	return c.JSON(http.StatusOK, movies)
}

func getMoviesByIdHandler(c echo.Context) error {
	id := c.Param("id")
	row := db.QueryRow("SELECT * FROM goimdb WHERE imdbID = ?", id)
	m := Movie{}
	err := row.Scan(&m.ID, &m.ImdbID, &m.Title, &m.Year, &m.Rating, &m.IsSuperhero)
	if err != nil {
		return c.JSON(http.StatusNotFound, map[string]string{
			"error": "movie not found",
		})
	}
	return c.JSON(http.StatusOK, m)
}

func updateMovieHandler(c echo.Context) error {
	id := c.Param("id")
	var payload Movie
	err := c.Bind(&payload)
	if err != nil {
		return c.JSON(http.StatusBadRequest, err.Error())
	}
	stmt, err := db.Prepare("UPDATE goimdb SET title = ?, year = ?, rating = ?, isSuperhero = ? WHERE imdbID = ?")
	if err != nil {
		return c.JSON(http.StatusInternalServerError, err.Error())
	}
	defer stmt.Close()
	res, err := stmt.Exec(payload.Title, payload.Year, payload.Rating, payload.IsSuperhero, id)
	if err != nil {
		return c.JSON(http.StatusInternalServerError, err.Error())
	}
	rowsAffected, err := res.RowsAffected()
	if err != nil {
		return c.JSON(http.StatusInternalServerError, err.Error())
	}
	if rowsAffected == 0 {
		return c.JSON(http.StatusNotFound, map[string]string{
			"error": "movie not found",
		})
	}
	return c.JSON(http.StatusOK, payload)
}

func deleteMovieHandler(c echo.Context) error {
	id := c.Param("id")
	stmt, err := db.Prepare("DELETE FROM goimdb WHERE imdbID = ?")
	if err != nil {
		return c.JSON(http.StatusInternalServerError, err.Error())
	}
	defer stmt.Close()
	res, err := stmt.Exec(id)
	if err != nil {
		return c.JSON(http.StatusInternalServerError, err.Error())
	}
	rowsAffected, err := res.RowsAffected()
	if err != nil {
		return c.JSON(http.StatusInternalServerError, err.Error())
	}
	if rowsAffected == 0 {
		return c.JSON(http.StatusNotFound, map[string]string{
			"error": "movie not found",
		})
	}
	return c.JSON(http.StatusOK, map[string]string{
		"message": "movie deleted successfully",
	})
}

func main() {
	connect()
	createTb := `
	CREATE TABLE IF NOT EXISTS goimdb(
	id INT AUTO_INCREMENT,
	imdbID TEXT NOT NULL UNIQUE,
	title TEXT NOT NULL,
	year INT NOT NULL,
	rating FLOAT NOT NULL,
	isSuperhero BOOLEAN NOT NULL,
	PRIMARY KEY (id)	
	);`
	_, err := db.Exec(createTb)
	if err != nil {
		log.Fatal("error", err)
		return
	}
	port := "2565"
	e := echo.New()
	e.GET("/movies", getAllMoviesHandler)
	e.GET("/movies/:id", getMoviesByIdHandler)
	e.POST("/movies", createMovieHandler)
	e.PUT("/movies/:id", updateMovieHandler)
	e.DELETE("/movies/:id", deleteMovieHandler)
	err = e.Start(":" + port)
	log.Fatal(err)
}
