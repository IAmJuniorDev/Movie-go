package routes

import (
	controllers "github.com/IAmJuniorDev/API-GO/controllers"
	"github.com/IAmJuniorDev/API-GO/middleware"
	"github.com/fasthttp/router"
)

// RegisterUserRoutes registers user-related routes
func UserRoutes(r *router.Router, prefix string) {

	r.POST(prefix+"/login", controllers.Login)
	r.GET(prefix+"/logout", controllers.Logout)
	r.POST(prefix+"/set-admin/{id}", controllers.SetAdmin)
	r.POST(prefix+"/unset-admin/{id}", controllers.UnsetAdmin)

	r.POST(prefix, controllers.CreateUser)
	r.GET(prefix, middleware.VerifyTokenAndAdmin(controllers.GetsUser))
	r.GET(prefix+"/{id}", middleware.VerifyTokenAndAdmin(controllers.GetUser))
	r.PUT(prefix+"/{id}", middleware.VerifyTokenAndAdmin(controllers.UpdateUser))
	r.DELETE(prefix+"/{id}", middleware.VerifyTokenAndAdmin(controllers.DeleteUser))
}
