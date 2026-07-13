export interface Segment {
  id: string
  task_id?: number
  start: number
  end: number
  text: string
  speaker?: string
  is_checked?: boolean
}