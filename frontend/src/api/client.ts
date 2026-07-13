const API_BASE_URL = 'http://localhost:8080/api'

function getToken(): string | null {
  return localStorage.getItem('sander_token')
}

export function setToken(token: string) {
  localStorage.setItem('sander_token', token)
}

export function clearToken() {
  localStorage.removeItem('sander_token')
}

interface RequestOptions extends RequestInit {
  skipAuth?: boolean
}

export async function apiClient<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const headers = new Headers(options.headers)
  headers.set('Content-Type', 'application/json')

  if (!options.skipAuth) {
    const token = getToken()
    if (token) headers.set('Authorization', `Bearer ${token}`)
  }

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers,
  })

  if (!response.ok) {
    const errorBody = await response.json().catch(() => ({ error: 'Unknown error' }))
    throw new Error(errorBody.error || `Request failed: ${response.status}`)
  }

  if (response.status === 204) return undefined as T

  return response.json()
}