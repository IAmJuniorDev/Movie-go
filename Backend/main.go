package main

import (
	"fmt"
	"log"
	"strconv"

	"github.com/IAmJuniorDev/API-GO/db"
	routes "github.com/IAmJuniorDev/API-GO/routes"
	"github.com/valyala/fasthttp"
)

func requestHandler(ctx *fasthttp.RequestCtx) {
	switch string(ctx.Path()) {
	case "/movies":
		switch string(ctx.Method()) {
		case "POST":
			routes.CreateMovies(ctx)
		case "GET":
			routes.GetMovies(ctx)
		default:
			ctx.Error("Method Not Allowed", fasthttp.StatusMethodNotAllowed)
		}
	default:
		if len(ctx.Path()) > 8 && string(ctx.Path()[:8]) == "/movies/" {
			id := string(ctx.Path()[8:])
			if _, err := strconv.Atoi(id); err != nil {
				ctx.Error("Invalid ID", fasthttp.StatusBadRequest)
				return
			}
			ctx.SetUserValue("id", id)

			switch string(ctx.Method()) {
			case "GET":
				routes.GetMovie(ctx)
			case "PUT":
				routes.UpdateMovie(ctx)
			case "DELETE":
				routes.DeleteMovie(ctx)
			default:
				ctx.Error("Method Not Allowed", fasthttp.StatusMethodNotAllowed)
			}
		} else {
			ctx.Error("Not Found", fasthttp.StatusNotFound)
		}
	}
}

func main() {
	db.InitDB()
	fmt.Println("Server running on :8080")
	log.Fatal(fasthttp.ListenAndServe(":8080", requestHandler))
}
