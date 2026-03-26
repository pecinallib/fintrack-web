import { useState, useEffect, useCallback } from 'react';
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import * as summaryService from '../services/summary';
import type { Summary } from '../services/summary';
import { getErrorMessage } from '../utils/getErrorMessage';
import PageHead from '../components/PageHead';
import PageTransition from '../components/PageTransition';
import AnimatedCard from '../components/AnimatedCard';
import { useTheme } from '../hooks/useTheme';

const COLORS = [
  '#6366f1',
  '#f43f5e',
  '#22c55e',
  '#f59e0b',
  '#3b82f6',
  '#a855f7',
  '#ec4899',
  '#14b8a6',
];

export default function Dashboard() {
  const [summary, setSummary] = useState<Summary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { theme } = useTheme();

  // Filtros de data
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');

  const loadData = useCallback(async () => {
    setLoading(true);
    setError('');

    try {
      const data = await summaryService.getSummary(
        dateFrom || undefined,
        dateTo || undefined,
      );
      setSummary(data);
    } catch (err: unknown) {
      setError(getErrorMessage(err, 'Erro ao carregar resumo'));
    } finally {
      setLoading(false);
    }
  }, [dateFrom, dateTo]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  function formatCurrency(value: number) {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  }

  function clearFilters() {
    setDateFrom('');
    setDateTo('');
  }

  const hasActiveFilters = dateFrom || dateTo;

  const tooltipStyle = {
    backgroundColor: theme === 'dark' ? '#1f2937' : '#ffffff',
    border: `1px solid ${theme === 'dark' ? '#374151' : '#e5e7eb'}`,
    borderRadius: '8px',
    color: theme === 'dark' ? '#f3f4f6' : '#111827',
  };

  const axisColor = theme === 'dark' ? '#9ca3af' : '#6b7280';

  if (error) {
    return (
      <div className="bg-red-500/10 border border-red-500/50 text-red-400 px-4 py-3 rounded-lg text-sm">
        {error}
      </div>
    );
  }

  return (
    <PageTransition>
      <div>
        <PageHead title="Dashboard" description="Resumo das suas finanças" />
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Dashboard
          </h1>
        </div>

        {/* Filtro de data */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-4 mb-6 shadow-sm transition-colors">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-semibold text-gray-700 dark:text-gray-300">
              Período
            </h2>
            {hasActiveFilters && (
              <button
                onClick={clearFilters}
                className="text-xs text-indigo-400 hover:text-indigo-300 transition-colors"
              >
                Limpar filtro
              </button>
            )}
          </div>
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

        {loading ? (
          <div className="flex items-center justify-center h-64">
            <p className="text-gray-500 dark:text-gray-400">Carregando...</p>
          </div>
        ) : !summary || summary.transactionCount === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 dark:text-gray-400 text-lg">
              {hasActiveFilters
                ? 'Nenhum dado no período selecionado'
                : 'Nenhum dado para exibir'}
            </p>
            <p className="text-gray-400 dark:text-gray-500 mt-1">
              {hasActiveFilters
                ? 'Tente ajustar as datas'
                : 'Adicione transações para ver o resumo'}
            </p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
              <AnimatedCard
                delay={0}
                className="bg-white dark:bg-gray-800 rounded-xl p-5 shadow-sm transition-colors"
              >
                <p className="text-gray-500 dark:text-gray-400 text-sm mb-1">
                  Receitas
                </p>
                <p className="text-2xl font-bold text-green-500 dark:text-green-400">
                  {formatCurrency(summary.totalIncome)}
                </p>
              </AnimatedCard>

              <AnimatedCard
                delay={0.1}
                className="bg-white dark:bg-gray-800 rounded-xl p-5 shadow-sm transition-colors"
              >
                <p className="text-gray-500 dark:text-gray-400 text-sm mb-1">
                  Despesas
                </p>
                <p className="text-2xl font-bold text-red-500 dark:text-red-400">
                  {formatCurrency(summary.totalExpense)}
                </p>
              </AnimatedCard>

              <AnimatedCard
                delay={0.2}
                className="bg-white dark:bg-gray-800 rounded-xl p-5 shadow-sm transition-colors"
              >
                <p className="text-gray-500 dark:text-gray-400 text-sm mb-1">
                  Saldo
                </p>
                <p
                  className={`text-2xl font-bold ${
                    summary.balance >= 0
                      ? 'text-green-500 dark:text-green-400'
                      : 'text-red-500 dark:text-red-400'
                  }`}
                >
                  {formatCurrency(summary.balance)}
                </p>
              </AnimatedCard>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white dark:bg-gray-800 rounded-xl p-5 shadow-sm transition-colors">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Receitas vs Despesas
                </h2>

                <ResponsiveContainer width="100%" height={250}>
                  <BarChart
                    data={[
                      {
                        name: 'Receitas',
                        value: summary.totalIncome,
                        color: '#22c55e',
                      },
                      {
                        name: 'Despesas',
                        value: summary.totalExpense,
                        color: '#f43f5e',
                      },
                    ]}
                  >
                    <XAxis
                      dataKey="name"
                      tick={{ fill: axisColor, fontSize: 13 }}
                      axisLine={false}
                      tickLine={false}
                    />
                    <YAxis
                      tick={{ fill: axisColor, fontSize: 12 }}
                      axisLine={false}
                      tickLine={false}
                    />
                    <Tooltip
                      contentStyle={tooltipStyle}
                      formatter={(value) => formatCurrency(Number(value))}
                      cursor={{
                        fill:
                          theme === 'dark'
                            ? 'rgba(255,255,255,0.06)'
                            : 'rgba(0,0,0,0.06)',
                      }}
                    />
                    <Bar dataKey="value" radius={[6, 6, 0, 0]}>
                      <Cell fill="#22c55e" />
                      <Cell fill="#f43f5e" />
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>

              {Object.keys(summary.expensesByCategory).length > 0 && (
                <div className="bg-white dark:bg-gray-800 rounded-xl p-5 shadow-sm transition-colors">
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                    Despesas por Categoria
                  </h2>
                  <ResponsiveContainer width="100%" height={250}>
                    <PieChart>
                      <Pie
                        data={Object.entries(summary.expensesByCategory).map(
                          ([name, value]) => ({ name, value }),
                        )}
                        cx="50%"
                        cy="50%"
                        innerRadius={55}
                        outerRadius={90}
                        paddingAngle={3}
                        dataKey="value"
                      >
                        {Object.entries(summary.expensesByCategory).map(
                          (_entry, index) => (
                            <Cell
                              key={index}
                              fill={COLORS[index % COLORS.length]}
                            />
                          ),
                        )}
                      </Pie>
                      <Tooltip
                        contentStyle={tooltipStyle}
                        formatter={(value) => formatCurrency(Number(value))}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="flex flex-wrap gap-3 mt-4 justify-center">
                    {Object.entries(summary.expensesByCategory).map(
                      ([name], index) => (
                        <div key={name} className="flex items-center gap-2">
                          <div
                            className="w-3 h-3 rounded-full"
                            style={{
                              backgroundColor: COLORS[index % COLORS.length],
                            }}
                          />
                          <span className="text-gray-500 dark:text-gray-400 text-xs">
                            {name}
                          </span>
                        </div>
                      ),
                    )}
                  </div>
                </div>
              )}
            </div>

            <div className="mt-6 bg-white dark:bg-gray-800 rounded-xl p-5 shadow-sm transition-colors">
              <p className="text-gray-500 dark:text-gray-400 text-sm">
                Total de transações:{' '}
                <span className="text-gray-900 dark:text-white font-medium">
                  {summary.transactionCount}
                </span>
              </p>
            </div>
          </>
        )}
      </div>
    </PageTransition>
  );
}
