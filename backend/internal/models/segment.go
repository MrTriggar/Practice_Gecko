package models

type Segment struct {
	ID        int64   `json:"id"`
	TaskID    int64   `json:"task_id"`
	StartTime float64 `json:"start_time"`
	EndTime   float64 `json:"end_time"`
	Text      string  `json:"text"`
	IsChecked bool    `json:"is_checked"`
}