package main

import (
	"log"
	"os"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"

	"sander/backend/internal/db"
	"sander/backend/internal/handlers"
	"sander/backend/internal/repository"
	"sander/backend/internal/services"
)

func getenv(key, fallback string) string {
	if v := os.Getenv(key); v != "" {
		return v
	}
	return fallback
}

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

	userRepo := repository.NewUserRepository(conn)
	taskRepo := repository.NewTaskRepository(conn)
	segmentRepo := repository.NewSegmentRepository(conn)
	termRepo := repository.NewTermRepository(conn)

	jwtSecret := getenv("JWT_SECRET", "dev-secret-change-me")
	authService := services.NewAuthService(userRepo, jwtSecret)
	taskService := services.NewTaskService(taskRepo)
	segmentService := services.NewSegmentService(segmentRepo)
	termService := services.NewTermService(termRepo)
	exportService := services.NewExportService(taskRepo, segmentRepo)

	h := &handlers.Handlers{
		Auth:     handlers.NewAuthHandler(authService),
		Tasks:    handlers.NewTaskHandler(taskService),
		Segments: handlers.NewSegmentHandler(segmentService),
		Terms:    handlers.NewTermHandler(termService),
		Export:   handlers.NewExportHandler(exportService),
	}

	router := gin.Default()

	router.Use(cors.New(cors.Config{
		AllowOrigins:     []string{"http://localhost:5173"},
		AllowMethods:     []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"},
		AllowHeaders:     []string{"Origin", "Content-Type", "Authorization", "Range"},
		ExposeHeaders:    []string{"Content-Length", "Content-Range", "Accept-Ranges"},
		AllowCredentials: true,
	}))

	router.Static("/uploads", "/app/uploads")
	handlers.RegisterRoutes(router, h, authService)

	log.Println("starting server on :8080")
	if err := router.Run(":8080"); err != nil {
		log.Fatalf("server error: %v", err)
	}
}
