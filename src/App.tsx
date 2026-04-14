import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';
import { useAuth } from './hooks/useAuth';
import Activity from './pages/Activity';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Transactions from './pages/Transactions';
import Categories from './pages/Categories';
import Calculator from './pages/Calculator';
import Layout from './components/Layout';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';

function PrivateRoute({ children }: { children: React.ReactNode }) {
  const { signed, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 dark:bg-gray-900 flex items-center justify-center">
        <p className="text-gray-500 dark:text-gray-400">Carregando...</p>
      </div>
    );
  }

  return signed ? <>{children}</> : <Navigate to="/login" />;
}

function AppRoutes() {
  const { signed } = useAuth();

  return (
    <Routes>
      <Route path="/login" element={signed ? <Navigate to="/" /> : <Login />} />
      <Route
        path="/register"
        element={signed ? <Navigate to="/" /> : <Register />}
      />
      <Route
        path="/forgot-password"
        element={signed ? <Navigate to="/" /> : <ForgotPassword />}
      />
      <Route path="/reset-password" element={<ResetPassword />} />
      <Route
        path="/"
        element={
          <PrivateRoute>
            <Layout />
          </PrivateRoute>
        }
      >
        <Route index element={<Dashboard />} />
        <Route path="transactions" element={<Transactions />} />
        <Route path="categories" element={<Categories />} />
        <Route path="activity" element={<Activity />} />
        <Route path="calculator" element={<Calculator />} />
      </Route>
    </Routes>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <ThemeProvider>
        <AuthProvider>
          <AppRoutes />
        </AuthProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
}
