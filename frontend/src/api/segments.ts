import { apiClient } from './client'
import type { Segment } from '../types/segment'

interface BackendSegment {
  id: number
  task_id: number
  start_time: number
  end_time: number
  text: string
  is_checked: boolean
}

function toFrontend(s: BackendSegment): Segment {
  return {
    id: String(s.id),
    start: s.start_time,
    end: s.end_time,
    text: s.text,
    isChecked: s.is_checked,
  }
}

export async function listSegmentsByTask(taskId: number): Promise<Segment[]> {
  const data = await apiClient<BackendSegment[]>(`/tasks/${taskId}/segments`)
  return data.map(toFrontend)
}

export async function getSegment(id: number): Promise<Segment> {
  const data = await apiClient<BackendSegment>(`/segments/${id}`)
  return toFrontend(data)
}

export async function createSegment(taskId: number, start: number, end: number, text: string): Promise<Segment> {
  const data = await apiClient<BackendSegment>('/segments', {
    method: 'POST',
    body: JSON.stringify({ task_id: taskId, start_time: start, end_time: end, text }),
  })
  return toFrontend(data)
}

export async function updateSegment(id: number, patch: Partial<{ start: number; end: number; text: string; isChecked: boolean }>): Promise<Segment> {
  const body: Record<string, unknown> = {}
  if (patch.start !== undefined) body.start_time = patch.start
  if (patch.end !== undefined) body.end_time = patch.end
  if (patch.text !== undefined) body.text = patch.text
  if (patch.isChecked !== undefined) body.is_checked = patch.isChecked

  const data = await apiClient<BackendSegment>(`/segments/${id}`, {
    method: 'PUT',
    body: JSON.stringify(body),
  })
  return toFrontend(data)
}

export async function importSegments(taskId: number, items: { start: number; end: number; text: string }[]): Promise<Segment[]> {
  const data = await apiClient<BackendSegment[]>(`/tasks/${taskId}/segments/import`, {
    method: 'POST',
    body: JSON.stringify({ segments: items }),
  })
  return data.map(toFrontend)
}