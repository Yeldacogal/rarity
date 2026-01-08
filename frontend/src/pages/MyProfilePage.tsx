import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { FiUser, FiCalendar, FiMessageSquare, FiList, FiLogOut, FiEdit2, FiBookmark, FiBell } from 'react-icons/fi';

export default function MyProfilePage() {
  const { user, logout } = useAuth();

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('tr-TR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  };

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen relative" style={{ backgroundImage: 'url(/bg-pattern.jpg)', backgroundSize: 'cover', backgroundPosition: 'center', backgroundAttachment: 'fixed' }}>
      <div className="absolute inset-0 bg-white/70"></div>
      <div className="relative max-w-2xl mx-auto px-4 py-8">
      <div className="window">
        <div className="window-header">
          <div className="flex gap-2">
            <div className="w-3 h-3 bg-red-400 rounded-full"></div>
            <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
            <div className="w-3 h-3 bg-green-400 rounded-full"></div>
          </div>
          <span>my_profile.exe</span>
          <div className="w-16"></div>
        </div>

        <div className="window-content">
          <div className="flex flex-col items-center mb-6">
            {user.avatarUrl ? (
              <img
                src={user.avatarUrl}
                alt="Avatar"
                className="w-24 h-24 rounded-full object-cover border-4 border-rose-200 mb-4"
              />
            ) : (
              <div className="w-24 h-24 bg-gradient-to-br from-rose-400 to-rose-600 rounded-full flex items-center justify-center mb-4">
                <FiUser className="text-white text-4xl" />
              </div>
            )}
            <h1 className="text-2xl font-bold text-gray-800">{user.name}</h1>
            <p className="text-gray-500">{user.email}</p>
            
            {user.bio && (
              <p className="text-gray-600 text-center mt-3 px-4 max-w-md">
                {user.bio}
              </p>
            )}

            <span className={`text-sm px-3 py-1 rounded-full mt-3 ${
              user.role === 'ADMIN'
                ? 'bg-purple-100 text-purple-700'
                : 'bg-rose-100 text-rose-700'
            }`}>
              {user.role === 'ADMIN' ? 'Admin' : 'Üye'}
            </span>

            {user.isBanned && (
              <span className="text-sm px-3 py-1 rounded-full mt-2 bg-red-100 text-red-700">
                Hesabınız askıya alındı
              </span>
            )}
          </div>

          <div className="flex items-center justify-center gap-2 text-gray-500 mb-8">
            <FiCalendar />
            <span>Üyelik: {formatDate(user.createdAt)}</span>
          </div>

          <div className="space-y-3">
            <Link
              to="/profile/edit"
              className="flex items-center gap-3 p-4 bg-rose-50 rounded-lg hover:bg-rose-100 transition-colors"
            >
              <FiEdit2 className="text-rose-500 text-xl" />
              <span className="text-gray-700 font-medium">Profili Düzenle</span>
            </Link>

            <Link
              to="/my/questions"
              className="flex items-center gap-3 p-4 bg-rose-50 rounded-lg hover:bg-rose-100 transition-colors"
            >
              <FiMessageSquare className="text-rose-500 text-xl" />
              <span className="text-gray-700 font-medium">Sorularım</span>
            </Link>

            <Link
              to="/bookmarks"
              className="flex items-center gap-3 p-4 bg-rose-50 rounded-lg hover:bg-rose-100 transition-colors"
            >
              <FiBookmark className="text-rose-500 text-xl" />
              <span className="text-gray-700 font-medium">Favorilerim</span>
            </Link>

            <Link
              to="/notifications"
              className="flex items-center gap-3 p-4 bg-rose-50 rounded-lg hover:bg-rose-100 transition-colors"
            >
              <FiBell className="text-rose-500 text-xl" />
              <span className="text-gray-700 font-medium">Bildirimler</span>
            </Link>

            <Link
              to="/questions"
              className="flex items-center gap-3 p-4 bg-rose-50 rounded-lg hover:bg-rose-100 transition-colors"
            >
              <FiList className="text-rose-500 text-xl" />
              <span className="text-gray-700 font-medium">Tüm Sorular</span>
            </Link>

            <button
              onClick={logout}
              className="w-full flex items-center gap-3 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors text-left"
            >
              <FiLogOut className="text-gray-500 text-xl" />
              <span className="text-gray-700 font-medium">Çıkış Yap</span>
            </button>
          </div>
        </div>
      </div>
      </div>
    </div>
  );
}
