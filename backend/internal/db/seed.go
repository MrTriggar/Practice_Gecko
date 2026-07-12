package db

import (
	"log"

	"golang.org/x/crypto/bcrypt"
	"gorm.io/gorm"

	"sander/backend/internal/models"
)

func SeedUsers(db *gorm.DB) error {
	users := []struct {
		email    string
		password string
		name     string
		role     string
	}{
		{"admin@mail.ru", "123", "Admin", "admin"},
		{"annotator@mail.ru", "123", "Annotator", "annotator"},
		{"verifier@mail.ru", "123", "Verifier", "verifier"},
	}

	for _, u := range users {
		var existing models.User
		err := db.Where("email = ?", u.email).First(&existing).Error
		if err == nil {
			continue 
		}

		hash, err := bcrypt.GenerateFromPassword([]byte(u.password), bcrypt.DefaultCost)
		if err != nil {
			return err
		}

		user := models.User{
			Email:        u.email,
			PasswordHash: string(hash),
			Name:         u.name,
			Role:         u.role,
		}
		if err := db.Create(&user).Error; err != nil {
			return err
		}
		log.Printf("seeded user: %s (%s)", u.email, u.role)
	}

	return nil
}