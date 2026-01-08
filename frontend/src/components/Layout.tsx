import { ReactNode, useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import api from '../lib/api';
import { FiHome, FiMessageSquare, FiUser, FiLogOut, FiSettings, FiPlus, FiBell } from 'react-icons/fi';

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const { user, logout, isAdmin } = useAuth();
  const navigate = useNavigate();
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    if (user) {
      fetchUnreadCount();
      const interval = setInterval(fetchUnreadCount, 30000);
      return () => clearInterval(interval);
    }
  }, [user]);

  const fetchUnreadCount = async () => {
    try {
      const response = await api.get('/notifications/unread-count');
      setUnreadCount(response.data);
    } catch (error) {
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-white border-b-4 border-rose-400 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <Link to="/" className="flex items-center gap-3 group">
              <img 
                src="/logo.png" 
                alt="Rarity Logo" 
                className="w-10 h-10 object-contain group-hover:scale-110 transition-transform"
              />
            </Link>

            <nav className="flex items-center gap-2">
              <Link
                to="/"
                className="flex items-center gap-1 px-3 py-2 text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
              >
                <FiHome />
                <span className="hidden sm:inline">Ana Sayfa</span>
              </Link>
              <Link
                to="/questions"
                className="flex items-center gap-1 px-3 py-2 text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
              >
                <FiMessageSquare />
                <span className="hidden sm:inline">Sorular</span>
              </Link>

              {user ? (
                <>
                  <Link
                    to="/questions/new"
                    className="flex items-center gap-1 px-3 py-2 bg-rose-500 text-white rounded-lg hover:bg-rose-600 transition-colors"
                  >
                    <FiPlus />
                    <span className="hidden sm:inline">Soru Sor</span>
                  </Link>

                  {isAdmin && (
                    <Link
                      to="/admin"
                      className="flex items-center gap-1 px-3 py-2 text-purple-600 hover:bg-purple-50 rounded-lg transition-colors"
                    >
                      <FiSettings />
                      <span className="hidden sm:inline">Admin</span>
                    </Link>
                  )}

                  <Link
                    to="/notifications"
                    className="relative flex items-center gap-1 px-3 py-2 text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                  >
                    <FiBell />
                    {unreadCount > 0 && (
                      <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                        {unreadCount > 9 ? '9+' : unreadCount}
                      </span>
                    )}
                  </Link>

                  <Link
                    to="/me"
                    className="flex items-center gap-1 px-3 py-2 text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                  >
                    <FiUser />
                    <span className="hidden sm:inline">{user.name}</span>
                  </Link>

                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-1 px-3 py-2 text-gray-500 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <FiLogOut />
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to="/login"
                    className="px-4 py-2 text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                  >
                    Giriş
                  </Link>
                  <Link
                    to="/register"
                    className="px-4 py-2 bg-rose-500 text-white rounded-lg hover:bg-rose-600 transition-colors"
                  >
                    Kayıt Ol
                  </Link>
                </>
              )}
            </nav>
          </div>
        </div>
      </header>

      {user?.isBanned && (
        <div className="bg-red-500 text-white text-center py-2 px-4">
          <span className="font-semibold">Hesabınız askıya alındı.</span> İçerik oluşturma, oy verme ve raporlama işlemleri yapılamaz.
        </div>
      )}

      <main className="flex-1 relative">
        {children}
      </main>

      <img 
        src="/cat.png" 
        alt="" 
        className="fixed bottom-4 left-4 w-32 h-32 opacity-60 pointer-events-none hidden lg:block"
      />
      <img 
        src="/bunny.png" 
        alt="" 
        className="fixed bottom-4 right-4 w-32 h-32 opacity-60 pointer-events-none hidden lg:block"
      />

      <footer className="bg-white border-t-2 border-rose-200 py-6 mt-auto">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-rose-400 text-sm">
            RARITY - Cilt Bakımı & Makyaj Soru-Cevap Topluluğu
          </p>
          <p className="text-gray-400 text-xs mt-2">
            © 2026 RARITY. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
