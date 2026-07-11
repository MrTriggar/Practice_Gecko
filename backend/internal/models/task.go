package models

import "time"

type Task struct {
	ID         int64     `json:"id"`
	ProjectID  int64     `json:"project_id"`
	AudioURL   string    `json:"audio_url"`
	AssigneeID *int64    `json:"assignee_id"`
	VerifierID *int64    `json:"verifier_id"`
	Status     string    `json:"status"` 
	CreatedAt  time.Time `json:"created_at"`
}