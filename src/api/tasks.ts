import apiClient from './client';
import type { Task } from '../types';

export const tasksApi = {
  // Получить все задачи
  getAll: () => {
    return apiClient.get<Task[]>('/tasks');
  },
  
  // Получить задачу по ID
  getById: (id: string) => {
    return apiClient.get<Task>(`/tasks/${id}`);
  },
  
  // Создать задачу
  create: (data: Partial<Task>) => {
    return apiClient.post<Task>('/tasks', data);
  },
  
  // Обновить задачу
  update: (id: string, data: Partial<Task>) => {
    return apiClient.put<Task>(`/tasks/${id}`, data);
  },
  
  // Отправить на проверку
  submit: (id: string) => {
    return apiClient.post(`/tasks/${id}/submit`);
  },
  
  // Экспортировать
  export: (id: string) => {
    return apiClient.get(`/tasks/${id}/export`, { responseType: 'blob' });
  },
};