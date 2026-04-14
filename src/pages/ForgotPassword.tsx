import { useState, type FormEvent } from 'react';
import { Link } from 'react-router-dom';
import PageHead from '../components/PageHead';
import PageTransition from '../components/PageTransition';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const { default: api } = await import('../services/api');
      await api.post('/auth/forgot-password', { email });
      setSent(true);
    } catch {
      setError('Erro ao enviar email. Tente novamente.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <PageTransition>
      <div className="min-h-screen bg-gray-900 flex items-center justify-center px-4">
        <PageHead title="Esqueceu a Senha" description="Recupere sua senha" />
        <div className="w-full max-w-md bg-gray-800 rounded-2xl p-8 shadow-lg">
          <h1 className="text-2xl font-bold text-white text-center mb-2">
            FinTrack
          </h1>
          <p className="text-gray-400 text-center mb-8">Recuperar senha</p>

          {sent ? (
            <div className="text-center">
              <div className="bg-green-500/10 border border-green-500/50 text-green-400 px-4 py-3 rounded-lg mb-6 text-sm">
                Se o email estiver cadastrado, você receberá um link de
                recuperação.
              </div>
              <Link
                to="/login"
                className="text-indigo-400 hover:text-indigo-300 text-sm"
              >
                Voltar para o login
              </Link>
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
                    Email
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                    placeholder="seu@email.com"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-semibold rounded-lg transition-colors"
                >
                  {loading ? 'Enviando...' : 'Enviar link de recuperação'}
                </button>
              </form>

              <p className="text-gray-400 text-center mt-6 text-sm">
                Lembrou a senha?{' '}
                <Link
                  to="/login"
                  className="text-indigo-400 hover:text-indigo-300"
                >
                  Faça login
                </Link>
              </p>
            </>
          )}
        </div>
      </div>
    </PageTransition>
  );
}
