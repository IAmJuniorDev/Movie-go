package routes

import (
	controllers "github.com/IAmJuniorDev/API-GO/controllers"
	"github.com/fasthttp/router"
)

// RegisterMovieRoutes registers movie-related routes
func MovieRoutes(r *router.Router, prefix string) {
	r.GET(prefix, controllers.GetMovies)
	r.POST(prefix, controllers.CreateMovies)
	r.GET(prefix+"/{id}", controllers.GetMovie)
	r.PUT(prefix+"/{id}", controllers.UpdateMovie)
	r.DELETE(prefix+"/{id}", controllers.DeleteMovie)
}
