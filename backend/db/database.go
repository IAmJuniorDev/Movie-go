package db

import (
	"log"
	"os"

	models "github.com/IAmJuniorDev/API-GO/models"
	"gorm.io/driver/mysql"
	"gorm.io/gorm"
)

var DB *gorm.DB

func InitDB() {
	var err error
	dsn := os.Getenv("DB")
	// dsn := "root:IAmDeveloper012.@tcp(127.0.0.1:3306)/Movie_DB?charset=utf8mb4&parseTime=True&loc=Local"
	DB, err = gorm.Open(mysql.Open(dsn), &gorm.Config{})
	if err != nil {
		log.Fatal("Failed to connect to MySQL:", err)
	}

	if err := DB.AutoMigrate(
		&models.Movie{},
		&models.User{},
	); err != nil {
		log.Fatal("Failed to migrate database:", err)
	}

	log.Println("Connected to MySQL successfully!")
}
