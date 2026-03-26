import { Link, NavLink, Outlet } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import ThemeToggle from './ThemeToggle';
import logo from '../assets/logo.png';

export default function Layout() {
  const { user, logout } = useAuth();

  const linkClass = ({ isActive }: { isActive: boolean }) =>
    `text-sm font-medium transition-colors ${
      isActive
        ? 'text-indigo-400'
        : 'text-gray-400 hover:text-gray-200 dark:text-gray-400 dark:hover:text-gray-200'
    }`;

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 transition-colors">
      <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 transition-colors">
        <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-16">
            <Link
              to="/"
              className="hover:scale-[1.3] transition-all duration-500"
            >
              <img width={100} src={logo} alt="FinTrack" />
            </Link>
            <nav className="flex gap-6">
              <NavLink to="/" className={linkClass} end>
                Dashboard
              </NavLink>
              <NavLink to="/transactions" className={linkClass}>
                Transações
              </NavLink>
              <NavLink to="/categories" className={linkClass}>
                Categorias
              </NavLink>
            </nav>
          </div>
          <div className="flex items-center gap-4">
            <ThemeToggle />
            <span className="text-gray-500 dark:text-gray-400 text-sm">
              {user?.name}
            </span>
            <button
              onClick={logout}
              className="text-sm text-gray-500 dark:text-gray-400 hover:text-red-400 transition-colors"
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
