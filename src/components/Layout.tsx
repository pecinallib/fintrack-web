import { Outlet } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

export default function Layout() {
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen bg-gray-900">
      <header className="bg-gray-800 border-b border-gray-700">
        <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-xl font-bold text-white">FinTrack</h1>
          <div className="flex items-center gap-4">
            <span className="text-gray-400 text-sm">{user?.name}</span>
            <button
              onClick={logout}
              className="text-sm text-gray-400 hover:text-red-400 transition-colors"
            >
              Sair
            </button>
          </div>
        </div>
      </header>
      <main className="max-w-5xl mx-auto px-4 py-8">
        <Outlet />
      </main>
    </div>
  );
}
