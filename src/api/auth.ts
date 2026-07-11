import apiClient from './client';
import type { AuthResponse, LoginCredentials } from '../types';

export const authApi = {
  // Вход в систему
  login: (credentials: LoginCredentials) => {
    return apiClient.post<AuthResponse>('/auth/login', credentials);
  },
  
  // Выход из системы
  logout: () => {
    return apiClient.post('/auth/logout');
  },
  
  // Получение текущего пользователя
  getCurrentUser: () => {
    return apiClient.get('/auth/me');
  },
};