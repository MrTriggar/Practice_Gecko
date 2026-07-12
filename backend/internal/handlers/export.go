package handlers

import (
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"

	"sander/backend/internal/services"
)

type ExportHandler struct {
	export *services.ExportService
}

func NewExportHandler(export *services.ExportService) *ExportHandler {
	return &ExportHandler{export: export}
}

func (h *ExportHandler) ExportTask(c *gin.Context) {
	id, err := strconv.ParseInt(c.Param("id"), 10, 64)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid id"})
		return
	}

	format := c.DefaultQuery("format", "json")

	result, err := h.export.ExportTask(c.Request.Context(), id, format)
	if err != nil {
		switch err {
		case services.ErrExportTaskNotFound:
			c.JSON(http.StatusNotFound, gin.H{"error": "task not found"})
		case services.ErrUnsupportedFormat:
			c.JSON(http.StatusBadRequest, gin.H{"error": "unsupported format, use json or csv"})
		default:
			c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		}
		return
	}

	c.Header("Content-Disposition", "attachment; filename="+result.Filename)
	c.Data(http.StatusOK, result.ContentType, result.Data)
}