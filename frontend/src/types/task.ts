export interface Task {
  id: number
  project_id: number
  audio_url: string
  assignee_id?: number
  verifier_id?: number
  status: 'pending' | 'in_progress' | 'verification' | 'rework' | 'done'
}