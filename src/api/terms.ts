import apiClient from './client';
import type { Term } from '../types';

export const termsApi = {
  // Получить все термины проекта
  getByProjectId: (projectId: string) => {
    return apiClient.get<Term[]>(`/projects/${projectId}/terms`);
  },
  
  // Создать термин
  create: (projectId: string, data: Partial<Term>) => {
    return apiClient.post<Term>(`/projects/${projectId}/terms`, data);
  },
  
  // Обновить термин
  update: (id: string, data: Partial<Term>) => {
    return apiClient.put<Term>(`/terms/${id}`, data);
  },
  
  // Подтвердить термин
  approve: (id: string) => {
    return apiClient.post(`/terms/${id}/approve`);
  },
  
  // Отклонить термин
  reject: (id: string) => {
    return apiClient.post(`/terms/${id}/reject`);
  },
};