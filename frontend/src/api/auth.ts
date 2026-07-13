import { apiClient, setToken, clearToken } from './client'

export interface User {
  id: number
  email: string
  name: string
  role: string
}

export interface AuthResult {
  token: string
  user: User
}

interface LoginPayload {
  email: string
  password: string
}

export async function login(payload: LoginPayload): Promise<AuthResult> {
  const result = await apiClient<AuthResult>('/auth/login', {
    method: 'POST',
    body: JSON.stringify(payload),
    skipAuth: true,
  })

  setToken(result.token)
  return result
}

export async function register(payload: LoginPayload): Promise<AuthResult> {
  const result = await apiClient<AuthResult>('/auth/register', {
    method: 'POST',
    body: JSON.stringify(payload),
    skipAuth: true,
  })

  setToken(result.token)
  return result
}

export async function fetchMe(): Promise<{ user_id: number }> {
  return apiClient('/auth/me')
}

export function logout() {
  clearToken()
}