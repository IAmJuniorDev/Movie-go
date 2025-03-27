package routes

import (
	"github.com/fasthttp/router"
)

func RegisterRoutes(r *router.Router, prefix string) {

	UserRoutes(r, prefix+"/user")
	MovieRoutes(r, prefix+"/movies")
}
