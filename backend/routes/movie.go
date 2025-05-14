package routes

import (
	controllers "github.com/IAmJuniorDev/API-GO/controllers"
	"github.com/IAmJuniorDev/API-GO/middleware"
	"github.com/fasthttp/router"
)

func MovieRoutes(r *router.Router, prefix string) {
	r.GET(prefix+"/admin", middleware.VerifyTokenAndAdmin(controllers.GetMoviesAdmin))
	r.GET(prefix+"/admin/{id}", middleware.VerifyTokenAndAdmin(controllers.GetMovieImage))
	r.PUT(prefix+"/{id}", middleware.VerifyTokenAndAdmin(controllers.UpdateMovie))
	r.PUT(prefix+"/addpic/{id}", middleware.VerifyTokenAndAuthorization(controllers.AddPictureIntoMovie))
	r.POST(prefix+"/admin", middleware.VerifyTokenAndAdmin(controllers.CreateMoviesAdmin))
	r.DELETE(prefix+"/{id}", middleware.VerifyTokenAndAdmin(controllers.DeleteMovie))

	r.POST(prefix, middleware.VerifyTokenAndAuthorization(controllers.CreateMovies))
	r.GET(prefix, middleware.VerifyTokenAndAuthorization(controllers.GetMovies))
	r.GET(prefix+"/{id}", middleware.VerifyTokenAndAuthorization(controllers.GetMovie))
}
