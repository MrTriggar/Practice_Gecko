import apiClient from './client';
import type { Segment } from '../types';

export const segmentsApi = {
  // Получить все сегменты задачи
  getByTaskId: (taskId: string) => {
    return apiClient.get<Segment[]>(`/tasks/${taskId}/segments`);
  },
  
  // Обновить сегмент (автосохранение)
  update: (id: string, data: Partial<Segment>) => {
    return apiClient.put<Segment>(`/segments/${id}`, data);
  },
  
  // Создать сегмент
  create: (taskId: string, data: Partial<Segment>) => {
    return apiClient.post<Segment>(`/tasks/${taskId}/segments`, data);
  },
  
  // Удалить сегмент
  delete: (id: string) => {
    return apiClient.delete(`/segments/${id}`);
  },
  
  // Проверить сегменты на ошибки
  validate: (taskId: string) => {
    return apiClient.post(`/tasks/${taskId}/segments/validate`);
  },
};