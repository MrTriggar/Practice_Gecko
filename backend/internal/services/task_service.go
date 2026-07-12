package services

import (
	"context"
	"errors"
	"time"

	"sander/backend/internal/models"
	"sander/backend/internal/repository"
)

var ErrTaskNotFound = errors.New("task not found")

type TaskService struct {
	tasks repository.TaskRepository
}

func NewTaskService(tasks repository.TaskRepository) *TaskService {
	return &TaskService{tasks: tasks}
}

type CreateTaskInput struct {
	ProjectID int64
	AudioURL  string
}

type UpdateTaskInput struct {
	AssigneeID *int64
	VerifierID *int64
	Status     *string
}

func (s *TaskService) List(ctx context.Context) ([]models.Task, error) {
	return s.tasks.List(ctx)
}

func (s *TaskService) ListByAssignee(ctx context.Context, userID int64) ([]models.Task, error) {
	return s.tasks.ListByAssignee(ctx, userID)
}

func (s *TaskService) ListByStatus(ctx context.Context, status string) ([]models.Task, error) {
	return s.tasks.ListByStatus(ctx, status)
}

func (s *TaskService) Get(ctx context.Context, id int64) (*models.Task, error) {
	task, err := s.tasks.GetByID(ctx, id)
	if err != nil {
		return nil, err
	}
	if task == nil {
		return nil, ErrTaskNotFound
	}
	return task, nil
}

func (s *TaskService) Create(ctx context.Context, input CreateTaskInput) (*models.Task, error) {
	task := &models.Task{
		ProjectID: input.ProjectID,
		AudioURL:  input.AudioURL,
		Status:    "pending",
		CreatedAt: time.Now().UTC(),
	}

	if err := s.tasks.Create(ctx, task); err != nil {
		return nil, err
	}

	return task, nil
}

func (s *TaskService) Update(ctx context.Context, id int64, input UpdateTaskInput) (*models.Task, error) {
	task, err := s.Get(ctx, id)
	if err != nil {
		return nil, err
	}

	if input.AssigneeID != nil {
		task.AssigneeID = input.AssigneeID
	}
	if input.VerifierID != nil {
		task.VerifierID = input.VerifierID
	}
	if input.Status != nil {
		task.Status = *input.Status
	}

	if err := s.tasks.Update(ctx, task); err != nil {
		return nil, err
	}

	return task, nil
}

func (s *TaskService) SubmitForVerification(ctx context.Context, id int64) (*models.Task, error) {
	status := "verification"
	return s.Update(ctx, id, UpdateTaskInput{Status: &status})
}

func (s *TaskService) Approve(ctx context.Context, id int64) (*models.Task, error) {
	status := "done"
	return s.Update(ctx, id, UpdateTaskInput{Status: &status})
}

func (s *TaskService) Rework(ctx context.Context, id int64) (*models.Task, error) {
	status := "rework"
	return s.Update(ctx, id, UpdateTaskInput{Status: &status})
}

func (s *TaskService) Delete(ctx context.Context, id int64) error {
	if _, err := s.Get(ctx, id); err != nil {
		return err
	}
	return s.tasks.Delete(ctx, id)
}
