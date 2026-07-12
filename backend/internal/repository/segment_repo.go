package repository

import (
	"context"
	"errors"

	"gorm.io/gorm"

	"sander/backend/internal/models"
)

type SegmentRepository interface {
	ListByTaskID(ctx context.Context, taskID int64) ([]models.Segment, error)
	GetByID(ctx context.Context, id int64) (*models.Segment, error)
	Create(ctx context.Context, segment *models.Segment) error
	CreateBatch(ctx context.Context, segments []models.Segment) error
	Update(ctx context.Context, segment *models.Segment) error
}

type segmentRepository struct {
	db *gorm.DB
}

func NewSegmentRepository(db *gorm.DB) SegmentRepository {
	return &segmentRepository{db: db}
}

func (r *segmentRepository) ListByTaskID(ctx context.Context, taskID int64) ([]models.Segment, error) {
	var segments []models.Segment
	err := r.db.WithContext(ctx).Where("task_id = ?", taskID).Find(&segments).Error
	return segments, err
}

func (r *segmentRepository) GetByID(ctx context.Context, id int64) (*models.Segment, error) {
	var segment models.Segment
	err := r.db.WithContext(ctx).First(&segment, id).Error
	if errors.Is(err, gorm.ErrRecordNotFound) {
		return nil, nil
	}
	if err != nil {
		return nil, err
	}
	return &segment, nil
}

func (r *segmentRepository) Create(ctx context.Context, segment *models.Segment) error {
	return r.db.WithContext(ctx).Create(segment).Error
}

func (r *segmentRepository) CreateBatch(ctx context.Context, segments []models.Segment) error {
	return r.db.WithContext(ctx).Create(&segments).Error
}

func (r *segmentRepository) Update(ctx context.Context, segment *models.Segment) error {
	return r.db.WithContext(ctx).Save(segment).Error
}