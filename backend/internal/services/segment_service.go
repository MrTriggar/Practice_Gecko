package services

import (
	"context"
	"errors"

	"sander/backend/internal/models"
	"sander/backend/internal/repository"
)

var ErrSegmentNotFound = errors.New("segment not found")

type SegmentService struct {
	segments repository.SegmentRepository
}

func NewSegmentService(segments repository.SegmentRepository) *SegmentService {
	return &SegmentService{segments: segments}
}

type CreateSegmentInput struct {
	TaskID    int64
	StartTime float64
	EndTime   float64
	Text      string
}

type UpdateSegmentInput struct {
	StartTime *float64
	EndTime   *float64
	Text      *string
	IsChecked *bool
}

func (s *SegmentService) ListByTask(ctx context.Context, taskID int64) ([]models.Segment, error) {
	return s.segments.ListByTaskID(ctx, taskID)
}

func (s *SegmentService) Get(ctx context.Context, id int64) (*models.Segment, error) {
	segment, err := s.segments.GetByID(ctx, id)
	if err != nil {
		return nil, err
	}
	if segment == nil {
		return nil, ErrSegmentNotFound
	}
	return segment, nil
}

func (s *SegmentService) Create(ctx context.Context, input CreateSegmentInput) (*models.Segment, error) {
	segment := &models.Segment{
		TaskID:    input.TaskID,
		StartTime: input.StartTime,
		EndTime:   input.EndTime,
		Text:      input.Text,
		IsChecked: false,
	}

	if err := s.segments.Create(ctx, segment); err != nil {
		return nil, err
	}

	return segment, nil
}

// ImportSegments сохраняет пачку сегментов из JSON-предразметки (загрузка файла).
func (s *SegmentService) ImportSegments(ctx context.Context, taskID int64, inputs []CreateSegmentInput) ([]models.Segment, error) {
	segments := make([]models.Segment, 0, len(inputs))
	for _, in := range inputs {
		segments = append(segments, models.Segment{
			TaskID:    taskID,
			StartTime: in.StartTime,
			EndTime:   in.EndTime,
			Text:      in.Text,
			IsChecked: false,
		})
	}
	if err := s.segments.CreateBatch(ctx, segments); err != nil {
		return nil, err
	}
	return segments, nil
}

// Update — идемпотентный метод для автосохранения (PUT /segments/{id}).
// Всегда возвращает актуальную (сохранённую) версию сегмента.
func (s *SegmentService) Update(ctx context.Context, id int64, input UpdateSegmentInput) (*models.Segment, error) {
	segment, err := s.Get(ctx, id)
	if err != nil {
		return nil, err
	}

	if input.StartTime != nil {
		segment.StartTime = *input.StartTime
	}
	if input.EndTime != nil {
		segment.EndTime = *input.EndTime
	}
	if input.Text != nil {
		segment.Text = *input.Text
	}
	if input.IsChecked != nil {
		segment.IsChecked = *input.IsChecked
	}

	if err := s.segments.Update(ctx, segment); err != nil {
		return nil, err
	}

	return segment, nil
}
