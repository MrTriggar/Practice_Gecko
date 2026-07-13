const BACKEND_ORIGIN = 'http://localhost:8080'

function authHeaders(): HeadersInit {
  const token = localStorage.getItem('token')
  return {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`,
  }
}

export interface Term {
  id: number
  project_id: number
  text: string
  status: 'pending' | 'approved' | 'rejected'
  comment: string
}

export async function listTermsByProject(projectId: number): Promise<Term[]> {
  const res = await fetch(`${BACKEND_ORIGIN}/api/projects/${projectId}/terms`, {
    headers: authHeaders(),
  })
  if (!res.ok) throw new Error('Failed to load terms')
  return res.json()
}

export async function createTerm(projectId: number, text: string): Promise<Term> {
  const res = await fetch(`${BACKEND_ORIGIN}/api/terms`, {
    method: 'POST',
    headers: authHeaders(),
    body: JSON.stringify({ project_id: projectId, text }),
  })
  if (!res.ok) throw new Error('Failed to create term')
  return res.json()
}

export async function updateTerm(
  id: number,
  data: { status?: string; comment?: string }
): Promise<Term> {
  const res = await fetch(`${BACKEND_ORIGIN}/api/terms/${id}`, {
    method: 'PUT',
    headers: authHeaders(),
    body: JSON.stringify(data),
  })
  if (!res.ok) throw new Error('Failed to update term')
  return res.json()
}

export async function deleteTerm(id: number): Promise<void> {
  const res = await fetch(`${BACKEND_ORIGIN}/api/terms/${id}`, {
    method: 'DELETE',
    headers: authHeaders(),
  })
  if (!res.ok) throw new Error('Failed to delete term')
}