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

  const loadData = useCallback(async () => {
    try {
      const data = await summaryService.getSummary();
      setSummary(data);
    } catch (err: unknown) {
      setError(getErrorMessage(err, 'Erro ao carregar resumo'));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  function formatCurrency(value: number) {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-gray-400">Carregando...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-500/10 border border-red-500/50 text-red-400 px-4 py-3 rounded-lg text-sm">
        {error}
      </div>
    );
  }

  if (!summary || summary.transactionCount === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-400 text-lg">Nenhum dado para exibir</p>
        <p className="text-gray-500 mt-1">
          Adicione transações para ver o resumo
        </p>
      </div>
    );
  }

  const pieData = Object.entries(summary.expensesByCategory).map(
    ([name, value]) => ({
      name,
      value,
    }),
  );

  const barData = [
    { name: 'Receitas', value: summary.totalIncome, color: '#22c55e' },
    { name: 'Despesas', value: summary.totalExpense, color: '#f43f5e' },
  ];

  return (
    <PageTransition>
      <div>
        <PageHead title="Dashboard" description="Resumo das suas finanças" />
        <h1 className="text-2xl font-bold text-white mb-6">Dashboard</h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <AnimatedCard delay={0} className="bg-gray-800 rounded-xl p-5">
            <p className="text-gray-400 text-sm mb-1">Receitas</p>
            <p className="text-2xl font-bold text-green-400">
              {formatCurrency(summary.totalIncome)}
            </p>
          </AnimatedCard>

          <AnimatedCard delay={0.1} className="bg-gray-800 rounded-xl p-5">
            <p className="text-gray-400 text-sm mb-1">Despesas</p>
            <p className="text-2xl font-bold text-red-400">
              {formatCurrency(summary.totalExpense)}
            </p>
          </AnimatedCard>

          <AnimatedCard delay={0.2} className="bg-gray-800 rounded-xl p-5">
            <p className="text-gray-400 text-sm mb-1">Saldo</p>
            <p
              className={`text-2xl font-bold ${
                summary.balance >= 0 ? 'text-green-400' : 'text-red-400'
              }`}
            >
              {formatCurrency(summary.balance)}
            </p>
          </AnimatedCard>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-gray-800 rounded-xl p-5">
            <h2 className="text-lg font-semibold text-white mb-4">
              Receitas vs Despesas
            </h2>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={barData}>
                <XAxis
                  dataKey="name"
                  tick={{ fill: '#9ca3af', fontSize: 13 }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  tick={{ fill: '#9ca3af', fontSize: 12 }}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1f2937',
                    border: '1px solid #374151',
                    borderRadius: '8px',
                    color: '#f3f4f6',
                  }}
                  formatter={(value) => formatCurrency(Number(value))}
                />
                <Bar dataKey="value" radius={[6, 6, 0, 0]}>
                  {barData.map((entry, index) => (
                    <Cell key={index} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          {pieData.length > 0 && (
            <div className="bg-gray-800 rounded-xl p-5">
              <h2 className="text-lg font-semibold text-white mb-4">
                Despesas por Categoria
              </h2>
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={55}
                    outerRadius={90}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {pieData.map((_entry, index) => (
                      <Cell key={index} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#1f2937',
                      border: '1px solid #374151',
                      borderRadius: '8px',
                      color: '#f3f4f6',
                    }}
                    formatter={(value) => formatCurrency(Number(value))}
                  />
                </PieChart>
              </ResponsiveContainer>
              <div className="flex flex-wrap gap-3 mt-4 justify-center">
                {pieData.map((entry, index) => (
                  <div key={entry.name} className="flex items-center gap-2">
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: COLORS[index % COLORS.length] }}
                    />
                    <span className="text-gray-400 text-xs">{entry.name}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="mt-6 bg-gray-800 rounded-xl p-5">
          <p className="text-gray-400 text-sm">
            Total de transações:{' '}
            <span className="text-white font-medium">
              {summary.transactionCount}
            </span>
          </p>
        </div>
      </div>
    </PageTransition>
  );
}
