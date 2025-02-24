package db

import (
	"log"

	"github.com/IAmJuniorDev/API-GO/models"
	"gorm.io/driver/sqlserver"
	"gorm.io/gorm"
)

// DB instance
var DB *gorm.DB

// Initialize Database
func InitDB() {
	var err error

	// Replace with your actual SQL Server connection details
	dsn := "Server=20.212.114.233\\;Database=test_move;User Id=administrator_db;Password=P@$$w0rdQasDB;TrustServerCertificate=True"

	// Connect to SQL Server
	DB, err = gorm.Open(sqlserver.Open(dsn), &gorm.Config{})
	if err != nil {
		log.Fatal("Failed to connect to SQL Server:", err)
	}

	// Auto-migrate the Movie model
	if err := DB.AutoMigrate(&models.Movie{}); err != nil {
		log.Fatal("Failed to migrate database:", err)
	}

	log.Println("Connected to SQL Server successfully!")
}
