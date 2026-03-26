import api from './api';
import type { Category } from '../types/transaction';

export async function getAll(): Promise<Category[]> {
  const response = await api.get<Category[]>('/categories');
  return response.data;
}
