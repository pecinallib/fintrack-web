import { useState, useEffect, useCallback } from 'react';
import * as activityService from '../services/activity';
import type { ActivityLog } from '../types/activity';
import { getErrorMessage } from '../utils/getErrorMessage';
import PageHead from '../components/PageHead';
import PageTransition from '../components/PageTransition';

const ACTION_LABELS: Record<string, string> = {
  create: 'Criou',
  update: 'Editou',
  delete: 'Deletou',
};

const ACTION_COLORS: Record<string, string> = {
  create: 'bg-green-500/10 text-green-500 dark:text-green-400',
  update: 'bg-indigo-500/10 text-indigo-500 dark:text-indigo-400',
  delete: 'bg-red-500/10 text-red-500 dark:text-red-400',
};

const ENTITY_LABELS: Record<string, string> = {
  transaction: 'Transação',
  category: 'Categoria',
};

export default function Activity() {
  const [logs, setLogs] = useState<ActivityLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadData = useCallback(async () => {
    try {
      const data = await activityService.getRecent();
      setLogs(data);
    } catch (err: unknown) {
      setError(getErrorMessage(err, 'Erro ao carregar histórico'));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  function formatDate(date: string) {
    return new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(new Date(date));
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
        <PageHead title="Histórico" description="Últimas ações realizadas" />
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
          Histórico
        </h1>

        {error && (
          <div className="bg-red-500/10 border border-red-500/50 text-red-400 px-4 py-3 rounded-lg mb-4 text-sm">
            {error}
          </div>
        )}

        {logs.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 dark:text-gray-400 text-lg">
              Nenhuma ação registrada
            </p>
            <p className="text-gray-400 dark:text-gray-500 mt-1">
              Suas ações aparecerão aqui automaticamente
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {logs.map((log) => (
              <div
                key={log.id}
                className="bg-white dark:bg-gray-800 rounded-xl p-4 flex items-center gap-4 shadow-sm transition-colors"
              >
                <div
                  className={`px-3 py-1 rounded-full text-xs font-semibold ${ACTION_COLORS[log.action]}`}
                >
                  {ACTION_LABELS[log.action]}
                </div>

                <div className="flex-1">
                  <p className="text-gray-900 dark:text-white text-sm">
                    {log.details ||
                      `${ACTION_LABELS[log.action]} ${ENTITY_LABELS[log.entity]}`}
                  </p>
                  <p className="text-gray-400 dark:text-gray-500 text-xs mt-1">
                    {ENTITY_LABELS[log.entity]} · {formatDate(log.createdAt)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </PageTransition>
  );
}
