import api from './api';

export interface Summary {
  totalIncome: number;
  totalExpense: number;
  balance: number;
  transactionCount: number;
  expensesByCategory: Record<string, number>;
}

export async function getSummary(): Promise<Summary> {
  const response = await api.get<Summary>('/transactions/summary');
  return response.data;
}
