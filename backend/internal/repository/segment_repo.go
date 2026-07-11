package repository

import (
	"context"

	"sander/backend/internal/models"
)

type SegmentRepository interface {
	ListByTaskID(ctx context.Context, taskID int64) ([]models.Segment, error)
	GetByID(ctx context.Context, id int64) (*models.Segment, error)
	Create(ctx context.Context, segment *models.Segment) error
	CreateBatch(ctx context.Context, segments []models.Segment) error
	Update(ctx context.Context, segment *models.Segment) error
}
