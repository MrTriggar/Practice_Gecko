package services

import (
	"context"
	"errors"

	"sander/backend/internal/models"
	"sander/backend/internal/repository"
)

var ErrTermNotFound = errors.New("term not found")

type TermService struct {
	terms repository.TermRepository
}

func NewTermService(terms repository.TermRepository) *TermService {
	return &TermService{terms: terms}
}

type CreateTermInput struct {
	ProjectID int64
	Text      string
}

type UpdateTermInput struct {
	Status  *string // approved, rejected, pending
	Comment *string
}

func (s *TermService) ListByProject(ctx context.Context, projectID int64) ([]models.Term, error) {
	return s.terms.ListByProjectID(ctx, projectID)
}

func (s *TermService) Create(ctx context.Context, input CreateTermInput) (*models.Term, error) {
	term := &models.Term{
		ProjectID: input.ProjectID,
		Text:      input.Text,
		Status:    "pending",
	}

	if err := s.terms.Create(ctx, term); err != nil {
		return nil, err
	}

	return term, nil
}

// Update используется, когда разметчик помечает термин как "спорный" с комментарием,
// либо когда его статус меняется (approved/rejected).
func (s *TermService) Update(ctx context.Context, id int64, input UpdateTermInput) (*models.Term, error) {
	term, err := s.terms.GetByID(ctx, id)
	if err != nil {
		return nil, err
	}
	if term == nil {
		return nil, ErrTermNotFound
	}

	if input.Status != nil {
		term.Status = *input.Status
	}
	if input.Comment != nil {
		term.Comment = *input.Comment
	}

	if err := s.terms.Update(ctx, term); err != nil {
		return nil, err
	}

	return term, nil
}

func (s *TermService) Delete(ctx context.Context, id int64) error {
	term, err := s.terms.GetByID(ctx, id)
	if err != nil {
		return err
	}
	if term == nil {
		return ErrTermNotFound
	}
	return s.terms.Delete(ctx, id)
}
