import { useState, useEffect, useCallback } from 'react';
import * as categoriesService from '../services/categories';
import type { Category } from '../types/transaction';
import { getErrorMessage } from '../utils/getErrorMessage';
import CategoryModal from '../components/CategoryModal';
import PageHead from '../components/PageHead';
import PageTransition from '../components/PageTransition';

export default function Categories() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Category | null>(null);

  const loadData = useCallback(async () => {
    try {
      const cats = await categoriesService.getAll();
      setCategories(cats);
    } catch (err: unknown) {
      setError(getErrorMessage(err, 'Erro ao carregar categorias'));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  async function handleSave(name: string) {
    if (editing) {
      await categoriesService.update(editing.id, name);
    } else {
      await categoriesService.create(name);
    }
    await loadData();
  }

  async function handleDelete(id: number) {
    if (!confirm('Tem certeza que deseja deletar esta categoria?')) return;

    try {
      await categoriesService.remove(id);
      await loadData();
    } catch (err: unknown) {
      setError(getErrorMessage(err, 'Erro ao deletar categoria'));
    }
  }

  function openCreate() {
    setEditing(null);
    setModalOpen(true);
  }

  function openEdit(category: Category) {
    setEditing(category);
    setModalOpen(true);
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
        <PageHead title="Categorias" description="Gerencie suas categorias" />
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Categorias
          </h1>
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

        {categories.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 dark:text-gray-400 text-lg">
              Nenhuma categoria ainda
            </p>
            <p className="text-gray-400 dark:text-gray-500 mt-1">
              Clique em "+ Nova" para começar
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {categories.map((cat) => (
              <div
                key={cat.id}
                className="bg-white dark:bg-gray-800 rounded-xl p-4 flex items-center justify-between shadow-sm transition-colors"
              >
                <h3 className="text-gray-900 dark:text-white font-medium">
                  {cat.name}
                </h3>
                <div className="flex gap-2">
                  <button
                    onClick={() => openEdit(cat)}
                    className="text-gray-400 hover:text-indigo-400 transition-colors text-sm"
                  >
                    Editar
                  </button>
                  <button
                    onClick={() => handleDelete(cat.id)}
                    className="text-gray-400 hover:text-red-400 transition-colors text-sm"
                  >
                    Deletar
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        <CategoryModal
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
          onSave={handleSave}
          category={editing}
        />
      </div>
    </PageTransition>
  );
}
