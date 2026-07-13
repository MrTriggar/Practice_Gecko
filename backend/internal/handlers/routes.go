package handlers

import (
	"github.com/gin-gonic/gin"

	"sander/backend/internal/services"
)

type Handlers struct {
	Auth     *AuthHandler
	Tasks    *TaskHandler
	Segments *SegmentHandler
	Terms    *TermHandler
	Export   *ExportHandler
}

func RegisterRoutes(router *gin.Engine, h Handlers, authService *services.AuthService) {
	api := router.Group("/api")
	api.POST("/auth/login", h.Auth.Login)

	protected := api.Group("/")
	protected.Use(AuthMiddleware(authService))

	protected.GET("/auth/me", h.Auth.Me)

	protected.GET("/tasks", h.Tasks.List)
	protected.GET("/tasks/:id", h.Tasks.Get)
	protected.POST("/tasks", h.Tasks.Create)
	protected.PUT("/tasks/:id", h.Tasks.Update)
	protected.DELETE("/tasks/:id", h.Tasks.Delete)
	protected.POST("/tasks/:id/submit", h.Tasks.Submit)
	protected.POST("/tasks/:id/approve", h.Tasks.Approve)
	protected.POST("/tasks/:id/rework", h.Tasks.Rework)
	protected.GET("/tasks/:id/export", h.Export.ExportTask)

	protected.GET("/tasks/:id/segments", h.Segments.ListByTask)
	protected.POST("/tasks/:id/segments/import", h.Segments.Import)
	protected.GET("/segments/:id", h.Segments.Get)
	protected.POST("/segments", h.Segments.Create)
	protected.PUT("/segments/:id", h.Segments.Update)

	protected.GET("/projects/:projectId/terms", h.Terms.ListByProject)
	protected.POST("/terms", h.Terms.Create)
	protected.PUT("/terms/:id", h.Terms.Update)

	protected.POST("/media/upload", UploadMedia)
}
