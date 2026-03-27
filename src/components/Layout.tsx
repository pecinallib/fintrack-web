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
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 transition-colors flex flex-col">
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
              <NavLink to="/calculator" className={linkClass}>
                Calculadora
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
              <NavLink to="/calculator" className={mobileLinkClass}>
                Calculadora
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

      <main className="max-w-5xl mx-auto px-4 py-8 flex-1 w-full">
        <Outlet />
      </main>

      <footer className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 transition-colors">
        <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
          <p className="text-gray-500 dark:text-gray-400 text-xs">
            © 2026 Matheus Pecinalli
          </p>
          <div className="flex items-center gap-4">
            <a
              href="https://github.com/pecinallib"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
              </svg>
            </a>
            <a
              href="https://www.linkedin.com/in/dev-pecinalli"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-blue-500 transition-colors"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
              </svg>
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
