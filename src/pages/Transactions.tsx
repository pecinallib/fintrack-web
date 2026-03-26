import { useState, useEffect, useCallback, useMemo } from 'react';
import * as transactionsService from '../services/transactions';
import * as categoriesService from '../services/categories';
import type { Transaction, TransactionRequest } from '../types/transaction';
import type { Category } from '../types/transaction';
import { getErrorMessage } from '../utils/getErrorMessage';
import TransactionModal from '../components/TransactionModal';
import PageHead from '../components/PageHead';
import PageTransition from '../components/PageTransition';

export default function Transactions() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Transaction | null>(null);

  // Filtros
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState<'all' | 'income' | 'expense'>(
    'all',
  );
  const [categoryFilter, setCategoryFilter] = useState('');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');

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

  const filtered = useMemo(() => {
    return transactions.filter((tx) => {
      if (search && !tx.title.toLowerCase().includes(search.toLowerCase())) {
        return false;
      }

      if (typeFilter !== 'all' && tx.type !== typeFilter) {
        return false;
      }

      if (categoryFilter && tx.categoryId !== Number(categoryFilter)) {
        return false;
      }

      if (dateFrom) {
        const txDate = new Date(tx.createdAt).toISOString().split('T')[0];
        if (txDate < dateFrom) return false;
      }

      if (dateTo) {
        const txDate = new Date(tx.createdAt).toISOString().split('T')[0];
        if (txDate > dateTo) return false;
      }

      return true;
    });
  }, [transactions, search, typeFilter, categoryFilter, dateFrom, dateTo]);

  const hasActiveFilters =
    search || typeFilter !== 'all' || categoryFilter || dateFrom || dateTo;

  function clearFilters() {
    setSearch('');
    setTypeFilter('all');
    setCategoryFilter('');
    setDateFrom('');
    setDateTo('');
  }

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
        <p className="text-gray-500 dark:text-gray-400">Carregando...</p>
      </div>
    );
  }

  return (
    <PageTransition>
      <div>
        <PageHead
          title="Transações"
          description="Gerencie suas receitas e despesas"
        />
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Transações
          </h1>
          <button
            onClick={openCreate}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg transition-colors"
          >
            + Nova
          </button>
        </div>

        {/* Filtros */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-4 mb-6 shadow-sm transition-colors space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold text-gray-700 dark:text-gray-300">
              Filtros
            </h2>
            {hasActiveFilters && (
              <button
                onClick={clearFilters}
                className="text-xs text-indigo-400 hover:text-indigo-300 transition-colors"
              >
                Limpar filtros
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {/* Pesquisa por texto */}
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Pesquisar por título..."
              className="px-4 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 text-sm transition-colors"
            />

            {/* Filtro por tipo */}
            <select
              value={typeFilter}
              onChange={(e) =>
                setTypeFilter(e.target.value as 'all' | 'income' | 'expense')
              }
              className="px-4 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 text-sm transition-colors"
            >
              <option value="all">Todos os tipos</option>
              <option value="income">Receitas</option>
              <option value="expense">Despesas</option>
            </select>

            {/* Filtro por categoria */}
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="px-4 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 text-sm transition-colors"
            >
              <option value="">Todas as categorias</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          {/* Filtro por data */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">
                De
              </label>
              <input
                type="date"
                value={dateFrom}
                onChange={(e) => setDateFrom(e.target.value)}
                className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 text-sm transition-colors"
              />
            </div>
            <div>
              <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">
                Até
              </label>
              <input
                type="date"
                value={dateTo}
                onChange={(e) => setDateTo(e.target.value)}
                className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 text-sm transition-colors"
              />
            </div>
          </div>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/50 text-red-400 px-4 py-3 rounded-lg mb-4 text-sm">
            {error}
          </div>
        )}

        {/* Contador de resultados */}
        {hasActiveFilters && (
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">
            {filtered.length}{' '}
            {filtered.length === 1 ? 'resultado' : 'resultados'} encontrado
            {filtered.length !== 1 ? 's' : ''}
          </p>
        )}

        {transactions.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 dark:text-gray-400 text-lg">
              Nenhuma transação ainda
            </p>
            <p className="text-gray-400 dark:text-gray-500 mt-1">
              Clique em "+ Nova" para começar
            </p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 dark:text-gray-400 text-lg">
              Nenhum resultado encontrado
            </p>
            <p className="text-gray-400 dark:text-gray-500 mt-1">
              Tente ajustar os filtros
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {filtered.map((tx) => (
              <div
                key={tx.id}
                className="bg-white dark:bg-gray-800 rounded-xl p-4 flex items-center justify-between shadow-sm transition-colors"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-3">
                    <h3 className="text-gray-900 dark:text-white font-medium">
                      {tx.title}
                    </h3>
                    {tx.category && (
                      <span className="text-xs bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 px-2 py-1 rounded-full">
                        {tx.category.name}
                      </span>
                    )}
                  </div>
                  <p className="text-gray-400 dark:text-gray-500 text-sm mt-1">
                    {formatDate(tx.createdAt)}
                  </p>
                </div>

                <div className="flex items-center gap-4">
                  <span
                    className={`font-semibold ${
                      tx.type === 'income'
                        ? 'text-green-500 dark:text-green-400'
                        : 'text-red-500 dark:text-red-400'
                    }`}
                  >
                    {tx.type === 'income' ? '+' : '-'}{' '}
                    {formatCurrency(tx.amount)}
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
    </PageTransition>
  );
}
