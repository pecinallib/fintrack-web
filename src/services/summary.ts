import api from './api';

export interface Summary {
  totalIncome: number;
  totalExpense: number;
  balance: number;
  transactionCount: number;
  expensesByCategory: Record<string, number>;
}

export async function getSummary(
  dateFrom?: string,
  dateTo?: string,
): Promise<Summary> {
  const params: Record<string, string> = {};

  if (dateFrom) params.dateFrom = dateFrom;
  if (dateTo) params.dateTo = dateTo;

  const response = await api.get<Summary>('/transactions/summary', { params });
  return response.data;
}
