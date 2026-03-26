export interface Category {
  id: number;
  name: string;
  userId: number;
}

export interface Transaction {
  id: number;
  title: string;
  amount: number;
  type: 'income' | 'expense';
  createdAt: string;
  userId: number;
  categoryId: number | null;
  category: Category | null;
}

export interface TransactionRequest {
  title: string;
  amount: number;
  type: 'income' | 'expense';
  categoryId?: number;
}
