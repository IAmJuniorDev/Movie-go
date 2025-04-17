package routes

import (
	controllers "github.com/IAmJuniorDev/API-GO/controllers"
	"github.com/IAmJuniorDev/API-GO/middleware"
	"github.com/fasthttp/router"
)

func MovieRoutes(r *router.Router, prefix string) {
	r.GET(prefix, middleware.VerifyTokenAndAuthorization(controllers.GetMovies))
	r.GET(prefix+"/admin", middleware.VerifyTokenAndAdmin(controllers.GetMoviesAdmin))
	r.POST(prefix, middleware.VerifyTokenAndAuthorization(controllers.CreateMovies))
	r.GET(prefix+"/{id}", middleware.VerifyTokenAndAuthorization(controllers.GetMovie))
	r.PUT(prefix+"/addpic/{id}", middleware.VerifyTokenAndAuthorization(controllers.AddPictureIntoMovie))
	r.PUT(prefix+"/{id}", middleware.VerifyTokenAndAuthorization(controllers.UpdateMovie))
	r.DELETE(prefix+"/{id}", middleware.VerifyTokenAndAuthorization(controllers.DeleteMovie))
}
