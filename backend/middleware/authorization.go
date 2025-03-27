package middleware

import (
	"os"
	"strings"
	"time"

	"github.com/golang-jwt/jwt/v5"
	"github.com/valyala/fasthttp"
)

func CorsMiddleware(next fasthttp.RequestHandler) fasthttp.RequestHandler {
	return func(ctx *fasthttp.RequestCtx) {
		ctx.Response.Header.Set("Access-Control-Allow-Origin", "http://localhost:3000") // Allow frontend
		ctx.Response.Header.Set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
		ctx.Response.Header.Set("Access-Control-Allow-Headers", "Content-Type, Authorization")
		ctx.Response.Header.Set("Access-Control-Allow-Credentials", "true")
		if string(ctx.Method()) == "OPTIONS" {
			ctx.SetStatusCode(fasthttp.StatusOK)
			return
		}
		next(ctx)
	}
}

func VerifyToken(next fasthttp.RequestHandler) fasthttp.RequestHandler {
	return func(ctx *fasthttp.RequestCtx) {
		// backend session
		auth := string(ctx.Request.Header.Peek("Authorization"))
		cookie := string(ctx.Request.Header.Cookie("session_token"))
		if auth == "" {
			ctx.SetStatusCode(fasthttp.StatusUnauthorized)
			ctx.SetBody([]byte("You are not authenticated! (auth)"))
			return
		}
		if cookie == "" {
			ctx.SetStatusCode(fasthttp.StatusUnauthorized)
			ctx.SetBody([]byte("You are not authenticated! (cookie)"))
			return
		}
		///////////
		//cookie//
		//////////
		tokenString := cookie
		token, err := jwt.ParseWithClaims(tokenString, &jwt.MapClaims{}, func(token *jwt.Token) (interface{}, error) {
			return []byte(os.Getenv("JWT_SECRET")), nil
		})
		if err != nil || !token.Valid {
			ctx.SetStatusCode(fasthttp.StatusForbidden)
			ctx.SetBody([]byte("Token is not valid"))
			return
		}
		claims, ok := token.Claims.(*jwt.MapClaims)
		if !ok || claims == nil {
			ctx.SetStatusCode(fasthttp.StatusForbidden)
			ctx.SetBody([]byte("Token claims are not valid"))
			return
		}
		exp := time.Unix(int64((*claims)["exp"].(float64)), 0)
		if exp.Before(time.Now()) {
			ctx.SetStatusCode(fasthttp.StatusForbidden)
			ctx.SetBody([]byte("Expried user at token"))
			return
		}
		////////
		//auth//
		////////
		tokenParts := strings.Split(auth, " ")
		if len(tokenParts) != 2 {
			ctx.SetStatusCode(fasthttp.StatusForbidden)
			ctx.SetBody([]byte("Token format is invalid"))
			return
		}
		tokenString1 := tokenParts[1]
		token1, err := jwt.ParseWithClaims(tokenString1, &jwt.MapClaims{}, func(token *jwt.Token) (interface{}, error) {
			return []byte(os.Getenv("JWT_SECRET")), nil
		})
		if err != nil || !token1.Valid {
			ctx.SetStatusCode(fasthttp.StatusForbidden)
			ctx.SetBody([]byte("Token is not valid"))
			return
		}
		claims1, ok := token1.Claims.(*jwt.MapClaims)
		if !ok || claims1 == nil {
			ctx.SetStatusCode(fasthttp.StatusForbidden)
			ctx.SetBody([]byte("Token claims are not valid"))
			return
		}
		exp1 := time.Unix(int64((*claims1)["exp"].(float64)), 0)
		if exp1.Before(time.Now()) {
			ctx.SetStatusCode(fasthttp.StatusForbidden)
			ctx.SetBody([]byte("Expried user at token"))
			return
		}
		userID := (*claims)["id"].(string)
		userID1 := (*claims1)["id"].(string)
		if userID != userID1 {
			ctx.SetStatusCode(fasthttp.StatusForbidden)
			ctx.SetBody([]byte("Not match username"))
			return
		}
		isAdmin := (*claims)["is_admin"].(bool)
		isAdmin1 := (*claims1)["is_admin"].(bool)
		if isAdmin != isAdmin1 {
			ctx.SetStatusCode(fasthttp.StatusForbidden)
			ctx.SetBody([]byte("not match status"))
			return
		}
		ctx.SetUserValue("user", userID1)
		ctx.SetUserValue("is_admin", isAdmin1)
		next(ctx)
	}
}

func VerifyTokenAndAuthorization(next fasthttp.RequestHandler) fasthttp.RequestHandler {
	return VerifyToken(func(ctx *fasthttp.RequestCtx) {
		user := ctx.UserValue("user")
		isAdmin := ctx.UserValue("is_admin").(bool)
		if user != nil || isAdmin {
			next(ctx)
		} else {
			ctx.SetStatusCode(fasthttp.StatusForbidden)
			ctx.SetBody([]byte("You are not authorized to access this resource"))
			return
		}
	})
}

func VerifyTokenAndAdmin(next fasthttp.RequestHandler) fasthttp.RequestHandler {
	return VerifyToken(func(ctx *fasthttp.RequestCtx) {
		isAdmin := ctx.UserValue("is_admin").(bool)
		if isAdmin {
			next(ctx)
		} else {
			ctx.SetStatusCode(fasthttp.StatusForbidden)
			ctx.SetBody([]byte("To access this you need to be aministrator"))
			return
		}
	})
}
