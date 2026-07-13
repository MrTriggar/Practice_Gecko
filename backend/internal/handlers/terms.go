package handlers

import (
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"

	"sander/backend/internal/services"
)

type TermHandler struct {
	terms *services.TermService
}

func NewTermHandler(terms *services.TermService) *TermHandler {
	return &TermHandler{terms: terms}
}

func (h *TermHandler) ListByProject(c *gin.Context) {
	projectID, err := strconv.ParseInt(c.Param("projectId"), 10, 64)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid project id"})
		return
	}

	terms, err := h.terms.ListByProject(c.Request.Context(), projectID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, terms)
}

type createTermRequest struct {
	ProjectID int64  `json:"project_id" binding:"required"`
	Text      string `json:"text" binding:"required"`
}

func (h *TermHandler) Create(c *gin.Context) {
	var req createTermRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	term, err := h.terms.Create(c.Request.Context(), services.CreateTermInput{
		ProjectID: req.ProjectID,
		Text:      req.Text,
	})
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusCreated, term)
}

type updateTermRequest struct {
	Status  *string `json:"status"`
	Comment *string `json:"comment"`
}

func (h *TermHandler) Update(c *gin.Context) {
	id, err := strconv.ParseInt(c.Param("id"), 10, 64)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid id"})
		return
	}

	var req updateTermRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	term, err := h.terms.Update(c.Request.Context(), id, services.UpdateTermInput{
		Status:  req.Status,
		Comment: req.Comment,
	})
	if err != nil {
		if err == services.ErrTermNotFound {
			c.JSON(http.StatusNotFound, gin.H{"error": "term not found"})
			return
		}
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, term)
}

func (h *TermHandler) Delete(c *gin.Context) {
	id, err := strconv.ParseInt(c.Param("id"), 10, 64)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid id"})
		return
	}

	if err := h.terms.Delete(c.Request.Context(), id); err != nil {
		if err == services.ErrTermNotFound {
			c.JSON(http.StatusNotFound, gin.H{"error": "term not found"})
			return
		}
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.Status(http.StatusNoContent)
}
