import axios from 'axios';
import { Subcategory, Category } from '../types';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
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

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const categoryApi = {
  getAll: () => 
    api.get<Category[]>('/categories'),
  getOne: (id: number) => 
    api.get<Category>(`/categories/${id}`),
  getBySlug: (slug: string) => 
    api.get<Category>(`/categories/slug/${slug}`),
  create: (data: { name: string; slug: string; description?: string; icon?: string; order?: number }) => 
    api.post<Category>('/categories', data),
  update: (id: number, data: { name?: string; slug?: string; description?: string; icon?: string; order?: number }) => 
    api.put<Category>(`/categories/${id}`, data),
  delete: (id: number) => 
    api.delete(`/categories/${id}`),
};

export const subcategoryApi = {
  getAll: (category?: string) => 
    api.get<Subcategory[]>('/tags/subcategories', { params: { category } }),
  getOne: (id: number) => 
    api.get<Subcategory>(`/tags/subcategories/${id}`),
  create: (data: { name: string; category: string }) => 
    api.post<Subcategory>('/tags/subcategories', data),
  update: (id: number, data: { name?: string; category?: string }) => 
    api.patch<Subcategory>(`/tags/subcategories/${id}`, data),
  delete: (id: number) => 
    api.delete(`/tags/subcategories/${id}`),
};

export default api;
