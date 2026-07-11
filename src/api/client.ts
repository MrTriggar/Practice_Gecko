import axios from 'axios';
import toast from 'react-hot-toast';

// Создаем экземпляр axios с базовыми настройками
const apiClient = axios.create({
  baseURL: '/api', // Все запросы будут идти на /api/*
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000, // 30 секунд таймаут
});

// Перехватчик запросов - добавляет токен авторизации
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Перехватчик ответов - обрабатывает ошибки
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    // Если 401 - не авторизован
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    
    // Показываем уведомление об ошибке
    const message = error.response?.data?.message || 'Произошла ошибка';
    toast.error(message);
    
    return Promise.reject(error);
  }
);

export default apiClient;