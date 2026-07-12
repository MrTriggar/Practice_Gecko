package repository

import (
	"context"

	"sander/backend/internal/models"
)

type TermRepository interface {
	ListByProjectID(ctx context.Context, projectID int64) ([]models.Term, error)
	GetByID(ctx context.Context, id int64) (*models.Term, error)
	Create(ctx context.Context, term *models.Term) error
	Update(ctx context.Context, term *models.Term) error
}