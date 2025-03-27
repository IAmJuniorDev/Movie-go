package main

import (
	"fmt"
	"log"

	"github.com/IAmJuniorDev/API-GO/db"
	"github.com/IAmJuniorDev/API-GO/initializers"
	"github.com/IAmJuniorDev/API-GO/middleware"
	"github.com/IAmJuniorDev/API-GO/routes"
	"github.com/fasthttp/router"
	"github.com/valyala/fasthttp"
)

func init() {
	initializers.LoadEnvVariables()
	db.InitDB()
}

func main() {
	r := router.New()
	routes.RegisterRoutes(r, "/api/v1")
	handler := middleware.CorsMiddleware(r.Handler)
	fmt.Println("Server running on :8080")
	log.Fatal(fasthttp.ListenAndServe(":8080", handler))
}
