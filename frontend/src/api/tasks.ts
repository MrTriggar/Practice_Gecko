import { apiClient } from './client'

export interface Task {
  id: number
  project_id: number
  audio_url: string
  assignee_id?: number
  verifier_id?: number
  status: 'pending' | 'in_progress' | 'verification' | 'rework' | 'done'
}

export async function listTasks(): Promise<Task[]> {
  return apiClient('/tasks')
}

export async function getTask(id: number): Promise<Task> {
  return apiClient(`/tasks/${id}`)
}

export async function createTask(projectId: number, audioUrl: string): Promise<Task> {
  return apiClient('/tasks', {
    method: 'POST',
    body: JSON.stringify({ project_id: projectId, audio_url: audioUrl }),
  })
}

export async function updateTask(id: number, data: Partial<Pick<Task, 'assignee_id' | 'verifier_id' | 'status'>>): Promise<Task> {
  return apiClient(`/tasks/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  })
}

export async function submitTask(id: number): Promise<Task> {
  return apiClient(`/tasks/${id}/submit`, { method: 'POST' })
}

export async function approveTask(id: number): Promise<Task> {
  return apiClient(`/tasks/${id}/approve`, { method: 'POST' })
}

export async function reworkTask(id: number): Promise<Task> {
  return apiClient(`/tasks/${id}/rework`, { method: 'POST' })
}

export async function deleteTask(id: number): Promise<void> {
  return apiClient(`/tasks/${id}`, { method: 'DELETE' })
}