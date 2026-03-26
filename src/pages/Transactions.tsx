import { useState, useEffect, useCallback } from 'react';
import * as transactionsService from '../services/transactions';
import * as categoriesService from '../services/categories';
import type { Transaction, TransactionRequest } from '../types/transaction';
import type { Category } from '../types/transaction';
import { getErrorMessage } from '../utils/getErrorMessage';
import TransactionModal from '../components/TransactionModal';

export default function Transactions() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Transaction | null>(null);

  const loadData = useCallback(async () => {
    try {
      const [txs, cats] = await Promise.all([
        transactionsService.getAll(),
        categoriesService.getAll(),
      ]);
      setTransactions(txs);
      setCategories(cats);
    } catch (err: unknown) {
      setError(getErrorMessage(err, 'Erro ao carregar dados'));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  async function handleSave(data: TransactionRequest) {
    if (editing) {
      await transactionsService.update(editing.id, data);
    } else {
      await transactionsService.create(data);
    }
    await loadData();
  }

  async function handleDelete(id: number) {
    if (!confirm('Tem certeza que deseja deletar esta transação?')) return;

    try {
      await transactionsService.remove(id);
      await loadData();
    } catch (err: unknown) {
      setError(getErrorMessage(err, 'Erro ao deletar transação'));
    }
  }

  function openCreate() {
    setEditing(null);
    setModalOpen(true);
  }

  function openEdit(transaction: Transaction) {
    setEditing(transaction);
    setModalOpen(true);
  }

  function formatCurrency(value: number) {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  }

  function formatDate(date: string) {
    return new Intl.DateTimeFormat('pt-BR').format(new Date(date));
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-gray-400">Carregando...</p>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-white">Transações</h1>
        <button
          onClick={openCreate}
          className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg transition-colors"
        >
          + Nova
        </button>
      </div>

      {error && (
        <div className="bg-red-500/10 border border-red-500/50 text-red-400 px-4 py-3 rounded-lg mb-4 text-sm">
          {error}
        </div>
      )}

      {transactions.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-400 text-lg">Nenhuma transação ainda</p>
          <p className="text-gray-500 mt-1">Clique em "+ Nova" para começar</p>
        </div>
      ) : (
        <div className="space-y-3">
          {transactions.map((tx) => (
            <div
              key={tx.id}
              className="bg-gray-800 rounded-xl p-4 flex items-center justify-between"
            >
              <div className="flex-1">
                <div className="flex items-center gap-3">
                  <h3 className="text-white font-medium">{tx.title}</h3>
                  {tx.category && (
                    <span className="text-xs bg-gray-700 text-gray-300 px-2 py-1 rounded-full">
                      {tx.category.name}
                    </span>
                  )}
                </div>
                <p className="text-gray-500 text-sm mt-1">
                  {formatDate(tx.createdAt)}
                </p>
              </div>

              <div className="flex items-center gap-4">
                <span
                  className={`font-semibold ${
                    tx.type === 'income' ? 'text-green-400' : 'text-red-400'
                  }`}
                >
                  {tx.type === 'income' ? '+' : '-'} {formatCurrency(tx.amount)}
                </span>

                <div className="flex gap-2">
                  <button
                    onClick={() => openEdit(tx)}
                    className="text-gray-400 hover:text-indigo-400 transition-colors text-sm"
                  >
                    Editar
                  </button>
                  <button
                    onClick={() => handleDelete(tx.id)}
                    className="text-gray-400 hover:text-red-400 transition-colors text-sm"
                  >
                    Deletar
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <TransactionModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSave={handleSave}
        categories={categories}
        transaction={editing}
      />
    </div>
  );
}
