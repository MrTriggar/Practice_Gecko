package repository

import (
	"context"
	"errors"

	"gorm.io/gorm"

	"sander/backend/internal/models"
)

type TermRepository interface {
	ListByProjectID(ctx context.Context, projectID int64) ([]models.Term, error)
	GetByID(ctx context.Context, id int64) (*models.Term, error)
	Create(ctx context.Context, term *models.Term) error
	Update(ctx context.Context, term *models.Term) error
}

type termRepository struct {
	db *gorm.DB
}

func NewTermRepository(db *gorm.DB) TermRepository {
	return &termRepository{db: db}
}

func (r *termRepository) ListByProjectID(ctx context.Context, projectID int64) ([]models.Term, error) {
	var terms []models.Term
	err := r.db.WithContext(ctx).Where("project_id = ?", projectID).Find(&terms).Error
	return terms, err
}

func (r *termRepository) GetByID(ctx context.Context, id int64) (*models.Term, error) {
	var term models.Term
	err := r.db.WithContext(ctx).First(&term, id).Error
	if errors.Is(err, gorm.ErrRecordNotFound) {
		return nil, nil
	}
	if err != nil {
		return nil, err
	}
	return &term, nil
}

func (r *termRepository) Create(ctx context.Context, term *models.Term) error {
	return r.db.WithContext(ctx).Create(term).Error
}

func (r *termRepository) Update(ctx context.Context, term *models.Term) error {
	return r.db.WithContext(ctx).Save(term).Error
}