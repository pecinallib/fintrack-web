import api from './api';
import type { Transaction, TransactionRequest } from '../types/transaction';

export async function getAll(): Promise<Transaction[]> {
  const response = await api.get<Transaction[]>('/transactions');
  return response.data;
}

export async function getById(id: number): Promise<Transaction> {
  const response = await api.get<Transaction>(`/transactions/${id}`);
  return response.data;
}

export async function create(data: TransactionRequest): Promise<Transaction> {
  const response = await api.post<Transaction>('/transactions', data);
  return response.data;
}

export async function update(
  id: number,
  data: Partial<TransactionRequest>,
): Promise<Transaction> {
  const response = await api.put<Transaction>(`/transactions/${id}`, data);
  return response.data;
}

export async function remove(id: number): Promise<void> {
  await api.delete(`/transactions/${id}`);
}
