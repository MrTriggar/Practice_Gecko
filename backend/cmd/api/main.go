package main

import (
	"log"

	"sander/backend/internal/db"
)

func main() {
	conn, err := db.Connect()
	if err != nil {
		log.Fatalf("db connect error: %v", err)
	}

	if err := db.AutoMigrate(conn); err != nil {
		log.Fatalf("automigrate error: %v", err)
	}

	if err := db.SeedUsers(conn); err != nil {
		log.Fatalf("seed error: %v", err)
	}

	log.Println("database ready")
}