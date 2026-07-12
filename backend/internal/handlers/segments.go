package handlers

import (
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"

	"sander/backend/internal/services"
)

type SegmentHandler struct {
	segments *services.SegmentService
}

func NewSegmentHandler(segments *services.SegmentService) *SegmentHandler {
	return &SegmentHandler{segments: segments}
}

// GET /api/tasks/:taskId/segments
func (h *SegmentHandler) ListByTask(c *gin.Context) {
	taskID, err := strconv.ParseInt(c.Param("taskId"), 10, 64)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid task id"})
		return
	}

	segments, err := h.segments.ListByTask(c.Request.Context(), taskID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, segments)
}

// GET /api/segments/:id
func (h *SegmentHandler) Get(c *gin.Context) {
	id, err := strconv.ParseInt(c.Param("id"), 10, 64)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid id"})
		return
	}

	segment, err := h.segments.Get(c.Request.Context(), id)
	if err != nil {
		if err == services.ErrSegmentNotFound {
			c.JSON(http.StatusNotFound, gin.H{"error": "segment not found"})
			return
		}
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, segment)
}

type createSegmentRequest struct {
	TaskID    int64   `json:"task_id" binding:"required"`
	StartTime float64 `json:"start_time"`
	EndTime   float64 `json:"end_time"`
	Text      string  `json:"text"`
}

// POST /api/segments
func (h *SegmentHandler) Create(c *gin.Context) {
	var req createSegmentRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	segment, err := h.segments.Create(c.Request.Context(), services.CreateSegmentInput{
		TaskID:    req.TaskID,
		StartTime: req.StartTime,
		EndTime:   req.EndTime,
		Text:      req.Text,
	})
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusCreated, segment)
}

type importSegmentItem struct {
	Start float64 `json:"start"`
	End   float64 `json:"end"`
	Text  string  `json:"text"`
}

type importSegmentsRequest struct {
	Segments []importSegmentItem `json:"segments" binding:"required"`
}

// POST /api/tasks/:taskId/segments/import — импорт JSON-предразметки при загрузке файла.
func (h *SegmentHandler) Import(c *gin.Context) {
	taskID, err := strconv.ParseInt(c.Param("taskId"), 10, 64)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid task id"})
		return
	}

	var req importSegmentsRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	inputs := make([]services.CreateSegmentInput, 0, len(req.Segments))
	for _, item := range req.Segments {
		inputs = append(inputs, services.CreateSegmentInput{
			TaskID:    taskID,
			StartTime: item.Start,
			EndTime:   item.End,
			Text:      item.Text,
		})
	}

	segments, err := h.segments.ImportSegments(c.Request.Context(), taskID, inputs)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusCreated, segments)
}

type updateSegmentRequest struct {
	StartTime *float64 `json:"start_time"`
	EndTime   *float64 `json:"end_time"`
	Text      *string  `json:"text"`
	IsChecked *bool    `json:"is_checked"`
}

// PUT /api/segments/:id — идемпотентный эндпоинт автосохранения.
func (h *SegmentHandler) Update(c *gin.Context) {
	id, err := strconv.ParseInt(c.Param("id"), 10, 64)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid id"})
		return
	}

	var req updateSegmentRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	segment, err := h.segments.Update(c.Request.Context(), id, services.UpdateSegmentInput{
		StartTime: req.StartTime,
		EndTime:   req.EndTime,
		Text:      req.Text,
		IsChecked: req.IsChecked,
	})
	if err != nil {
		if err == services.ErrSegmentNotFound {
			c.JSON(http.StatusNotFound, gin.H{"error": "segment not found"})
			return
		}
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	// Возвращаем ту же сохранённую версию сегмента — обеспечивает идемпотентность.
	c.JSON(http.StatusOK, segment)
}
