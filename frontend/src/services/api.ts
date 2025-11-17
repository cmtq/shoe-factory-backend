import axios from 'axios';
import type { Category, Product, Order, Inventory } from '../types';

// Use environment variable for API URL, fallback to relative path for development proxy
const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

// Categories
export const categoryAPI = {
  getAll: () => api.get<Category[]>('/categories'),
  getBySlug: (slug: string) => api.get<Category>(`/categories/${slug}`),
  create: (data: Partial<Category>) => api.post<Category>('/categories', data),
  update: (id: number, data: Partial<Category>) => api.put<Category>(`/categories/${id}`, data),
  delete: (id: number) => api.delete(`/categories/${id}`),
};

// Products
export const productAPI = {
  getAll: (params?: any) => api.get<{ products: Product[]; pagination: any }>('/products', { params }),
  getBySlug: (slug: string) => api.get<Product>(`/products/${slug}`),
  create: (data: Partial<Product>) => api.post<Product>('/products', data),
  update: (id: number, data: Partial<Product>) => api.put<Product>(`/products/${id}`, data),
  delete: (id: number) => api.delete(`/products/${id}`),
  addImage: (productId: number, data: any) => api.post(`/products/${productId}/images`, data),
};

// Inventory
export const inventoryAPI = {
  getAll: () => api.get<Inventory[]>('/inventory'),
  getByProduct: (productId: number) => api.get<Inventory[]>(`/inventory/product/${productId}`),
  checkAvailability: (productId: number, size: number) =>
    api.get<{ available: boolean; quantity: number }>(`/inventory/check/${productId}/${size}`),
  update: (productId: number, size: number, quantity: number) =>
    api.put(`/inventory/${productId}/${size}`, { quantity }),
  bulkUpdate: (items: Array<{ productId: number; size: number; quantity: number }>) =>
    api.post('/inventory/bulk', { items }),
};

// Orders
export const orderAPI = {
  create: (data: any) => api.post<Order>('/orders', data),
  getAll: (params?: any) => api.get<{ orders: Order[]; pagination: any }>('/orders', { params }),
  getById: (id: number) => api.get<Order>(`/orders/${id}`),
  updateStatus: (id: number, status: string) => api.patch<Order>(`/orders/${id}/status`, { status }),
};

export default api;
