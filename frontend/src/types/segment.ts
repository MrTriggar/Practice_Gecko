export interface Segment {
  id: string
  start: number
  end: number
  text: string
  speaker?: string
  isChecked?: boolean
}