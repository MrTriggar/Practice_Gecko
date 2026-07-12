package services

import (
	"bytes"
	"context"
	"encoding/csv"
	"encoding/json"
	"errors"
	"fmt"
	"strconv"

	"sander/backend/internal/models"
	"sander/backend/internal/repository"
)

var (
	ErrUnsupportedFormat  = errors.New("unsupported export format")
	ErrExportTaskNotFound = errors.New("task not found")
)

type ExportService struct {
	tasks    repository.TaskRepository
	segments repository.SegmentRepository
}

func NewExportService(tasks repository.TaskRepository, segments repository.SegmentRepository) *ExportService {
	return &ExportService{tasks: tasks, segments: segments}
}

type ExportResult struct {
	Filename    string
	ContentType string
	Data        []byte
}

type exportPayload struct {
	Task     models.Task      `json:"task"`
	Segments []models.Segment `json:"segments"`
}

func (s *ExportService) ExportTask(ctx context.Context, taskID int64, format string) (*ExportResult, error) {
	task, err := s.tasks.GetByID(ctx, taskID)
	if err != nil {
		return nil, err
	}
	if task == nil {
		return nil, ErrExportTaskNotFound
	}

	segments, err := s.segments.ListByTaskID(ctx, taskID)
	if err != nil {
		return nil, err
	}

	switch format {
	case "json":
		return s.exportJSON(task, segments)
	case "csv":
		return s.exportCSV(task, segments)
	default:
		return nil, ErrUnsupportedFormat
	}
}

func (s *ExportService) exportJSON(task *models.Task, segments []models.Segment) (*ExportResult, error) {
	payload := exportPayload{Task: *task, Segments: segments}
	data, err := json.MarshalIndent(payload, "", "  ")
	if err != nil {
		return nil, err
	}

	return &ExportResult{
		Filename:    fmt.Sprintf("task_%d.json", task.ID),
		ContentType: "application/json",
		Data:        data,
	}, nil
}

func (s *ExportService) exportCSV(task *models.Task, segments []models.Segment) (*ExportResult, error) {
	var buf bytes.Buffer
	writer := csv.NewWriter(&buf)

	if err := writer.Write([]string{"start_time", "end_time", "text", "is_checked"}); err != nil {
		return nil, err
	}

	for _, seg := range segments {
		if err := writer.Write([]string{
			strconv.FormatFloat(seg.StartTime, 'f', 2, 64),
			strconv.FormatFloat(seg.EndTime, 'f', 2, 64),
			seg.Text,
			strconv.FormatBool(seg.IsChecked),
		}); err != nil {
			return nil, err
		}
	}

	writer.Flush()
	if err := writer.Error(); err != nil {
		return nil, err
	}

	return &ExportResult{
		Filename:    fmt.Sprintf("task_%d.csv", task.ID),
		ContentType: "text/csv",
		Data:        buf.Bytes(),
	}, nil
}
