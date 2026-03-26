import { useState, useEffect, useRef, useCallback } from 'react';
import { Link, NavLink, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import ThemeToggle from './ThemeToggle';
import logo from '../assets/logo.png';

export default function Layout() {
  const { user, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const location = useLocation();
  const prevPathRef = useRef(location.pathname);

  const closeMenu = useCallback(() => setMenuOpen(false), []);

  // Fecha o menu ao mudar de rota
  useEffect(() => {
    if (prevPathRef.current !== location.pathname) {
      closeMenu();
      prevPathRef.current = location.pathname;
    }
  }, [location.pathname, closeMenu]);

  // Fecha o menu ao clicar fora
  useEffect(() => {
    if (!menuOpen) return;

    function handleClickOutside(e: MouseEvent) {
      if (
        menuRef.current &&
        !menuRef.current.contains(e.target as Node) &&
        buttonRef.current &&
        !buttonRef.current.contains(e.target as Node)
      ) {
        setMenuOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [menuOpen]);

  // Bloqueia scroll do body quando menu tá aberto
  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [menuOpen]);

  const linkClass = ({ isActive }: { isActive: boolean }) =>
    `text-sm font-medium transition-colors ${
      isActive
        ? 'text-indigo-400'
        : 'text-gray-400 hover:text-gray-200 dark:text-gray-400 dark:hover:text-gray-200'
    }`;

  const mobileLinkClass = ({ isActive }: { isActive: boolean }) =>
    `block px-6 py-4 text-base font-medium transition-colors ${
      isActive
        ? 'text-indigo-500 dark:text-indigo-400 bg-gray-100 dark:bg-gray-700/50'
        : 'text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700/50'
    }`;

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 transition-colors">
      <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 transition-colors relative z-50">
        <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-16">
            <Link
              to="/"
              className="hover:scale-[1.3] transition-all duration-500"
            >
              <img width={100} src={logo} alt="FinTrack" />
            </Link>

            <nav className="hidden md:flex gap-6">
              <NavLink to="/" className={linkClass} end>
                Dashboard
              </NavLink>
              <NavLink to="/transactions" className={linkClass}>
                Transações
              </NavLink>
              <NavLink to="/categories" className={linkClass}>
                Categorias
              </NavLink>
              <NavLink to="/activity" className={linkClass}>
                Histórico
              </NavLink>
            </nav>
          </div>

          <div className="flex items-center gap-4">
            <ThemeToggle />
            <span className="hidden md:inline text-gray-500 dark:text-gray-400 text-sm">
              {user?.name}
            </span>
            <button
              onClick={logout}
              className="hidden md:inline text-sm text-gray-500 dark:text-gray-400 hover:text-red-400 transition-colors"
            >
              Sair
            </button>

            <button
              ref={buttonRef}
              onClick={() => setMenuOpen(!menuOpen)}
              className="md:hidden p-2 rounded-lg bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
              aria-label="Menu"
            >
              <svg
                className="w-5 h-5 text-gray-700 dark:text-gray-300"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                {menuOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                )}
              </svg>
            </button>
          </div>
        </div>
      </header>

      {/* Overlay + Menu mobile */}
      {menuOpen && (
        <div className="md:hidden fixed inset-0 z-40">
          <div className="absolute inset-0 bg-black/70" onClick={closeMenu} />

          <div
            ref={menuRef}
            className="absolute top-0 right-0 w-64 h-full bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm shadow-2xl flex flex-col transition-colors"
          >
            {/* Header do menu */}
            <div className="px-6 py-5 border-b border-gray-200 dark:border-gray-700/50">
              <div className="flex items-center justify-between">
                <span className="text-gray-900 dark:text-white font-semibold text-sm">
                  {user?.name}
                </span>
                <button
                  onClick={closeMenu}
                  className="p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700/50 transition-colors"
                >
                  <svg
                    className="w-5 h-5 text-gray-500 dark:text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>
            </div>

            {/* Links */}
            <nav className="flex-1 py-4">
              <NavLink to="/" className={mobileLinkClass} end>
                Dashboard
              </NavLink>
              <NavLink to="/transactions" className={mobileLinkClass}>
                Transações
              </NavLink>
              <NavLink to="/categories" className={mobileLinkClass}>
                Categorias
              </NavLink>
              <NavLink to="/activity" className={mobileLinkClass}>
                Histórico
              </NavLink>
            </nav>

            {/* Footer do menu */}
            <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-700/50">
              <button
                onClick={() => {
                  logout();
                  closeMenu();
                }}
                className="w-full py-3 text-sm text-red-500 dark:text-red-400 hover:text-red-400 dark:hover:text-red-300 font-medium transition-colors"
              >
                Sair
              </button>
            </div>
          </div>
        </div>
      )}

      <main className="max-w-5xl mx-auto px-4 py-8">
        <Outlet />
      </main>
    </div>
  );
}
