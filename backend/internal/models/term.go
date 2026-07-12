package models

type Term struct {
	ID        int64  `json:"id"`
	ProjectID int64  `json:"project_id"`
	Text      string `json:"text"`
	Status    string `json:"status"` 
	Comment   string `json:"comment"`
}
