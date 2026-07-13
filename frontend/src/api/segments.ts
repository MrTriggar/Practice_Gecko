import type { Segment } from '../types/segment'

const BACKEND_ORIGIN = 'http://localhost:8080'

function authHeaders(): HeadersInit {
  const token = localStorage.getItem('token')
  return {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`,
  }
}

interface RawSegment {
  id: number
  task_id: number
  start_time: number
  end_time: number
  text: string
  is_checked: boolean
}

function mapSegment(raw: RawSegment): Segment {
  return {
    id: String(raw.id),
    task_id: raw.task_id,
    start: raw.start_time,
    end: raw.end_time,
    text: raw.text,
    is_checked: raw.is_checked,
  }
}

export async function listSegmentsByTask(taskId: number): Promise<Segment[]> {
  const res = await fetch(`${BACKEND_ORIGIN}/api/tasks/${taskId}/segments`, {
    headers: authHeaders(),
  })
  if (!res.ok) throw new Error('Failed to load segments')
  const data: RawSegment[] = await res.json()
  return data.map(mapSegment)
}

export async function updateSegment(
  segmentId: number,
  data: { text?: string; start_time?: number; end_time?: number; is_checked?: boolean }
): Promise<Segment> {
  const res = await fetch(`${BACKEND_ORIGIN}/api/segments/${segmentId}`, {
    method: 'PUT',
    headers: authHeaders(),
    body: JSON.stringify(data),
  })
  if (!res.ok) throw new Error('Failed to update segment')
  const raw: RawSegment = await res.json()
  return mapSegment(raw)
}

export async function importSegments(
  taskId: number,
  segments: { start: number; end: number; text: string }[]
): Promise<Segment[]> {
  const res = await fetch(`${BACKEND_ORIGIN}/api/tasks/${taskId}/segments/import`, {
    method: 'POST',
    headers: authHeaders(),
    body: JSON.stringify({ segments }),
  })
  if (!res.ok) throw new Error('Failed to import segments')
  const data: RawSegment[] = await res.json()
  return data.map(mapSegment)
}

export async function exportTask(taskId: number, format: 'json' | 'csv' | 'srt'): Promise<Blob> {
  const token = localStorage.getItem('token')
  const res = await fetch(`${BACKEND_ORIGIN}/api/tasks/${taskId}/export?format=${format}`, {
    headers: { Authorization: `Bearer ${token}` },
  })
  if (!res.ok) throw new Error('Export failed')
  return res.blob()
}