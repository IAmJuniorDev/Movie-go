package controllers

import (
	"bytes"
	"crypto/aes"
	"crypto/cipher"
	"encoding/base64"
	"encoding/json"
	"errors"
	"os"
	"time"

	"github.com/IAmJuniorDev/API-GO/db"
	models "github.com/IAmJuniorDev/API-GO/models"
	"github.com/golang-jwt/jwt/v5"

	"github.com/valyala/fasthttp"
)

type loginUser struct {
	Username string `json:"username"`
	Password string `json:"password"`
}

func EncryptAES(plainText, key string) (string, error) {
	block, err := aes.NewCipher([]byte(key)[:32]) // Ensure 32-byte key for AES-256
	if err != nil {
		return "", err
	}
	iv := []byte(os.Getenv("AES_KEY")) // 16-byte IV (same as in Crypto-JS)
	mode := cipher.NewCBCEncrypter(block, iv)
	// PKCS7 Padding
	padding := aes.BlockSize - len(plainText)%aes.BlockSize
	padText := append([]byte(plainText), bytes.Repeat([]byte{byte(padding)}, padding)...)
	cipherText := make([]byte, len(padText))
	mode.CryptBlocks(cipherText, padText)
	return base64.StdEncoding.EncodeToString(cipherText), nil
}

func DecryptAES(cipherText, key string) (string, error) {
	block, err := aes.NewCipher([]byte(key)[:32]) // Ensure 32-byte key for AES-256
	if err != nil {
		return "", err
	}
	cipherBytes, err := base64.StdEncoding.DecodeString(cipherText)
	if err != nil {
		return "", err
	}
	iv := []byte(os.Getenv("AES_KEY")) // 16-byte IV (same as in encryption)
	mode := cipher.NewCBCDecrypter(block, iv)
	plainText := make([]byte, len(cipherBytes))
	mode.CryptBlocks(plainText, cipherBytes)
	padding := int(plainText[len(plainText)-1])
	if padding > aes.BlockSize || padding == 0 {
		return "", errors.New("invalid padding")
	}
	plainText = plainText[:len(plainText)-padding]
	return string(plainText), nil
}

func CreateUser(ctx *fasthttp.RequestCtx) {
	var payload models.User
	if err := json.Unmarshal(ctx.PostBody(), &payload); err != nil {
		ctx.SetStatusCode(400)
		ctx.SetBody([]byte("Invalid JSON"))
		return
	}
	var existingUser models.User
	if err := db.DB.Where("username = ?", payload.Username).First(&existingUser).Error; err == nil {
		ctx.SetStatusCode(409)
		ctx.SetBody([]byte("Username already exists"))
		return
	}
	if err := db.DB.Where("email = ?", payload.Email).First(&existingUser).Error; err == nil {
		ctx.SetStatusCode(409)
		ctx.SetBody([]byte("email already exists"))
		return
	}
	hash, err := EncryptAES(payload.Password, os.Getenv("PASS_SECRET"))
	if err != nil {
		ctx.SetStatusCode(500)
		ctx.SetBody([]byte("Error while encrypting password"))
		return
	}
	payload.Password = hash
	payload.IsAdmin = false
	db.DB.Create(&payload)
	response, _ := json.Marshal(payload)
	ctx.SetStatusCode(201)
	ctx.SetBody(response)
}

func Login(ctx *fasthttp.RequestCtx) {
	var user loginUser
	if err := json.Unmarshal(ctx.PostBody(), &user); err != nil {
		ctx.SetStatusCode(400)
		ctx.SetBody([]byte("Invalid JSON"))
		return
	}
	var user2 models.User
	db.DB.First(&user2, "username=?", user.Username)
	if user2.ID == 0 {
		ctx.SetStatusCode(401)
		ctx.SetBody([]byte("Invalid username or password"))
		return
	}
	decrypt, err := DecryptAES(user2.Password, os.Getenv("PASS_SECRET"))
	if err != nil {
		ctx.SetStatusCode(500)
		ctx.SetBody([]byte("Error while decrypt password"))
		return
	}
	if decrypt != user.Password {
		ctx.SetStatusCode(401)
		// ctx.SetBody([]byte("Invalid password"))
		ctx.SetBody([]byte("Invalid username or password"))
		return
	}
	if user2.TimeStamp.Before(time.Now()) {
		ctx.SetStatusCode(401)
		ctx.SetBody([]byte("Your user have already expired"))
		return
	}
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, jwt.MapClaims{
		"id":       user2.Username,
		"exp":      user2.TimeStamp.Unix(),
		"is_admin": user2.IsAdmin,
	})
	tokenString, err := token.SignedString([]byte(os.Getenv("JWT_SECRET")))
	if err != nil {
		ctx.SetStatusCode(500)
		ctx.SetBody([]byte("Error while generating token"))
		return
	}
	cook := fasthttp.Cookie{}
	cook.SetKey("session_token")
	cook.SetValue(tokenString)
	cook.SetExpire(user2.TimeStamp)
	cook.SetHTTPOnly(true)
	cook.SetSecure(true)
	ctx.Response.Header.SetCookie(&cook)
	ctx.SetStatusCode(200)
	ctx.SetBody([]byte(tokenString))
}

func Logout(ctx *fasthttp.RequestCtx) {
	cook := fasthttp.Cookie{}
	cook.SetKey("session_token")
	cook.SetValue("")
	cook.SetExpire(time.Now().Add(-time.Hour))
	cook.SetHTTPOnly(true)
	cook.SetSecure(true)
	ctx.Response.Header.SetCookie(&cook)
	ctx.SetStatusCode(200)
	ctx.SetBody([]byte("Logged out"))
}

func SetAdmin(ctx *fasthttp.RequestCtx) {
	id := ctx.UserValue("id").(string)
	var user models.User
	if err := db.DB.First(&user, "username=?", id).Error; err != nil {
		ctx.SetStatusCode(404)
		ctx.SetBody([]byte("User not found"))
		return
	}
	user.IsAdmin = true
	db.DB.Save(&user)
	response, _ := json.Marshal(user)
	ctx.SetStatusCode(200)
	ctx.SetBody(response)
}

func UnsetAdmin(ctx *fasthttp.RequestCtx) {
	id := ctx.UserValue("id").(string)
	var user models.User
	if err := db.DB.First(&user, "username=?", id).Error; err != nil {
		ctx.SetStatusCode(404)
		ctx.SetBody([]byte("User not found"))
		return
	}
	user.IsAdmin = false
	db.DB.Save(&user)
	response, _ := json.Marshal(user)
	ctx.SetStatusCode(200)
	ctx.SetBody(response)
}

func GetsUser(ctx *fasthttp.RequestCtx) {
	var users []models.User
	db.DB.Find(&users)
	response, _ := json.Marshal(users)
	ctx.SetBody(response)
}

func GetUser(ctx *fasthttp.RequestCtx) {
	id := ctx.UserValue("id").(string)
	var user models.User
	if err := db.DB.First(&user, "username=?", id).Error; err != nil {
		ctx.SetStatusCode(404)
		ctx.SetBody([]byte("User not found"))
		return
	}
	response, _ := json.Marshal(user)
	ctx.SetStatusCode(200)
	ctx.SetBody(response)
}

func UpdateUser(ctx *fasthttp.RequestCtx) {
	id := ctx.UserValue("id").(string)
	var user models.User
	if err := db.DB.First(&user, "username=?", id).Error; err != nil {
		ctx.SetStatusCode(404)
		ctx.SetBody([]byte("User not found"))
		return
	}
	var newUser models.User
	if err := json.Unmarshal(ctx.PostBody(), &newUser); err != nil {
		ctx.SetStatusCode(400)
		ctx.SetBody([]byte("Invalid JSON"))
		return
	}
	newUser.ID = user.ID
	db.DB.Save(&newUser)
	response, _ := json.Marshal(newUser)
	ctx.SetStatusCode(200)
	ctx.SetBody(response)
}

func DeleteUser(ctx *fasthttp.RequestCtx) {
	id := ctx.UserValue("id").(string)
	var user models.User
	if err := db.DB.First(&user, "username=?", id).Error; err != nil {
		ctx.SetStatusCode(404)
		ctx.SetBody([]byte("User not found"))
		return
	}
	db.DB.Delete(&user)
	ctx.SetStatusCode(204)
	ctx.SetBody([]byte("User deleted"))
}
