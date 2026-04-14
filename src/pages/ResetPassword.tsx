import { useState, type FormEvent } from 'react';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import PageHead from '../components/PageHead';
import PageTransition from '../components/PageTransition';

export default function ResetPassword() {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get('token');

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('As senhas não coincidem');
      return;
    }

    if (password.length < 6) {
      setError('A senha deve ter no mínimo 6 caracteres');
      return;
    }

    setLoading(true);

    try {
      const { default: api } = await import('../services/api');
      await api.post('/auth/reset-password', { token, password });
      setSuccess(true);
      setTimeout(() => navigate('/login'), 3000);
    } catch {
      setError('Token inválido ou expirado. Solicite um novo link.');
    } finally {
      setLoading(false);
    }
  }

  if (!token) {
    return (
      <PageTransition>
        <div className="min-h-screen bg-gray-900 flex items-center justify-center px-4">
          <PageHead title="Link Inválido" description="Token não encontrado" />
          <div className="w-full max-w-md bg-gray-800 rounded-2xl p-8 shadow-lg text-center">
            <h1 className="text-2xl font-bold text-white mb-4">
              Link inválido
            </h1>
            <p className="text-gray-400 mb-6">
              O link de recuperação é inválido ou está incompleto.
            </p>
            <Link
              to="/forgot-password"
              className="text-indigo-400 hover:text-indigo-300"
            >
              Solicitar novo link
            </Link>
          </div>
        </div>
      </PageTransition>
    );
  }

  return (
    <PageTransition>
      <div className="min-h-screen bg-gray-900 flex items-center justify-center px-4">
        <PageHead title="Nova Senha" description="Defina sua nova senha" />
        <div className="w-full max-w-md bg-gray-800 rounded-2xl p-8 shadow-lg">
          <h1 className="text-2xl font-bold text-white text-center mb-2">
            FinTrack
          </h1>
          <p className="text-gray-400 text-center mb-8">Definir nova senha</p>

          {success ? (
            <div className="text-center">
              <div className="bg-green-500/10 border border-green-500/50 text-green-400 px-4 py-3 rounded-lg mb-6 text-sm">
                Senha alterada com sucesso! Redirecionando para o login...
              </div>
            </div>
          ) : (
            <>
              {error && (
                <div className="bg-red-500/10 border border-red-500/50 text-red-400 px-4 py-3 rounded-lg mb-6 text-sm">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    Nova senha
                  </label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    minLength={6}
                    className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                    placeholder="Mínimo 6 caracteres"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    Confirmar senha
                  </label>
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    minLength={6}
                    className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                    placeholder="Repita a senha"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-semibold rounded-lg transition-colors"
                >
                  {loading ? 'Alterando...' : 'Alterar senha'}
                </button>
              </form>

              <p className="text-gray-400 text-center mt-6 text-sm">
                <Link
                  to="/login"
                  className="text-indigo-400 hover:text-indigo-300"
                >
                  Voltar para o login
                </Link>
              </p>
            </>
          )}
        </div>
      </div>
    </PageTransition>
  );
}
