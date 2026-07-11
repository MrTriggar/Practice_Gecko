package repository

import (
	"context"
	"errors"

	"gorm.io/gorm"

	"sander/backend/internal/models"
)

type TaskRepository interface {
	List(ctx context.Context) ([]models.Task, error)
	ListByAssignee(ctx context.Context, userID int64) ([]models.Task, error)
	ListByStatus(ctx context.Context, status string) ([]models.Task, error)
	GetByID(ctx context.Context, id int64) (*models.Task, error)
	Create(ctx context.Context, task *models.Task) error
	Update(ctx context.Context, task *models.Task) error
	Delete(ctx context.Context, id int64) error
}

type taskRepository struct {
	db *gorm.DB
}

func NewTaskRepository(db *gorm.DB) TaskRepository {
	return &taskRepository{db: db}
}

func (r *taskRepository) List(ctx context.Context) ([]models.Task, error) {
	var tasks []models.Task
	err := r.db.WithContext(ctx).Find(&tasks).Error
	return tasks, err
}

func (r *taskRepository) ListByAssignee(ctx context.Context, userID int64) ([]models.Task, error) {
	var tasks []models.Task
	err := r.db.WithContext(ctx).Where("assignee_id = ?", userID).Find(&tasks).Error
	return tasks, err
}

func (r *taskRepository) ListByStatus(ctx context.Context, status string) ([]models.Task, error) {
	var tasks []models.Task
	err := r.db.WithContext(ctx).Where("status = ?", status).Find(&tasks).Error
	return tasks, err
}

func (r *taskRepository) GetByID(ctx context.Context, id int64) (*models.Task, error) {
	var task models.Task
	err := r.db.WithContext(ctx).First(&task, id).Error
	if errors.Is(err, gorm.ErrRecordNotFound) {
		return nil, nil
	}
	if err != nil {
		return nil, err
	}
	return &task, nil
}

func (r *taskRepository) Create(ctx context.Context, task *models.Task) error {
	return r.db.WithContext(ctx).Create(task).Error
}

func (r *taskRepository) Update(ctx context.Context, task *models.Task) error {
	return r.db.WithContext(ctx).Save(task).Error
}

func (r *taskRepository) Delete(ctx context.Context, id int64) error {
	return r.db.WithContext(ctx).Delete(&models.Task{}, id).Error
}