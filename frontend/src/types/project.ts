export type ProjectStatus = 'active' | 'archived'
export type TaskStatus = 'pending' | 'in_progress' | 'verification' | 'rework' | 'done'

export interface Project {
  id: string
  name: string
  description: string
  status: ProjectStatus
  tasksTotal: number
  tasksDone: number
}

export interface Task {
  id: string
  projectId: string
  title: string
  status: TaskStatus
  assignee?: string
}