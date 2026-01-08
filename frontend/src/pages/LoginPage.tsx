import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { FiMail, FiLock, FiLogIn } from 'react-icons/fi';

export default function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      await login(email, password);
      navigate('/');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Geçersiz email veya şifre');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="relative">
        <img 
          src="/zipzipKedi.gif" 
          alt="" 
          className="absolute -top-20 left-1/2 -translate-x-1/2 w-24 h-auto z-10"
        />
        
        <div className="window max-w-md w-full">
        <div className="window-header">
          <div className="flex gap-2">
            <div className="w-3 h-3 bg-red-400 rounded-full"></div>
            <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
            <div className="w-3 h-3 bg-green-400 rounded-full"></div>
          </div>
          <span>login.exe</span>
          <div className="w-16"></div>
        </div>
        
        <div className="window-content">
          <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
            Giriş Yap
          </h2>

          {error && (
            <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                E-posta
              </label>
              <div className="relative">
                <FiMail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border-2 border-rose-200 rounded-lg focus:border-rose-400 focus:outline-none"
                  placeholder="ornek@email.com"
                  required
                />
              </div>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Şifre
              </label>
              <div className="relative">
                <FiLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border-2 border-rose-200 rounded-lg focus:border-rose-400 focus:outline-none"
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full btn-primary rounded-lg flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <span>Giriş yapılıyor...</span>
              ) : (
                <>
                  <FiLogIn />
                  <span>Giriş Yap</span>
                </>
              )}
            </button>
          </form>

          <p className="mt-6 text-center text-gray-600">
            Hesabın yok mu?{' '}
            <Link to="/register" className="text-rose-600 hover:underline font-medium">
              Kayıt Ol
            </Link>
          </p>
        </div>
      </div>
      </div>
    </div>
  );
}
