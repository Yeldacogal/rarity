import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../lib/api';
import { useAuth } from '../contexts/AuthContext';
import { FiUser, FiCalendar, FiMessageSquare, FiMessageCircle, FiThumbsUp, FiSlash, FiCheck, FiTrash2 } from 'react-icons/fi';

interface UserProfile {
  id: number;
  name: string;
  avatarUrl?: string;
  bio?: string;
  role: string;
  isBanned: boolean;
  createdAt: string;
  questionsCount: number;
  answersCount: number;
  votesReceived: number;
}

export default function ProfilePage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user, isAdmin } = useAuth();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isBanning, setIsBanning] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    fetchProfile();
  }, [id]);

  const fetchProfile = async () => {
    try {
      const response = await api.get<UserProfile>(`/users/profile/${id}`);
      setProfile(response.data);
    } catch (error) {
      console.error('Failed to fetch profile:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('tr-TR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  };

  const handleBanToggle = async () => {
    if (!profile || !isAdmin) return;
    
    const action = profile.isBanned ? 'yasağını kaldırmak' : 'banlamak';
    if (!confirm(`Bu kullanıcıyı ${action} istediğinizden emin misiniz?`)) return;

    setIsBanning(true);
    try {
      await api.patch(`/users/${profile.id}/ban`, { isBanned: !profile.isBanned });
      setProfile({ ...profile, isBanned: !profile.isBanned });
    } catch (error) {
      console.error('Failed to toggle ban:', error);
      alert('İşlem başarısız oldu');
    } finally {
      setIsBanning(false);
    }
  };

  const handleDeleteUser = async () => {
    if (!profile || !isAdmin) return;
    
    if (!confirm(`"${profile.name}" kullanıcısını silmek istediğinizden emin misiniz? Bu işlem geri alınamaz!`)) return;

    setIsDeleting(true);
    try {
      await api.delete(`/users/${profile.id}`);
      alert('Kullanıcı başarıyla silindi');
      navigate('/admin/users');
    } catch (error) {
      console.error('Failed to delete user:', error);
      alert('Kullanıcı silinemedi');
    } finally {
      setIsDeleting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-8">
        <div className="animate-pulse">
          <div className="h-32 bg-gray-200 rounded-lg mb-4"></div>
          <div className="h-8 bg-gray-200 rounded w-1/2 mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-1/3"></div>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-8 text-center">
        <p className="text-gray-500">Kullanıcı bulunamadı.</p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <div className="window">
        <div className="window-header">
          <div className="flex gap-2">
            <div className="w-3 h-3 bg-red-400 rounded-full"></div>
            <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
            <div className="w-3 h-3 bg-green-400 rounded-full"></div>
          </div>
          <span>profile.exe</span>
          <div className="w-16"></div>
        </div>

        <div className="window-content">
          <div className="flex flex-col items-center mb-6">
            {profile.avatarUrl ? (
              <img
                src={profile.avatarUrl}
                alt="Avatar"
                className="w-24 h-24 rounded-full object-cover border-4 border-rose-200 mb-4"
              />
            ) : (
              <div className="w-24 h-24 bg-gradient-to-br from-rose-400 to-rose-600 rounded-full flex items-center justify-center mb-4">
                <FiUser className="text-white text-4xl" />
              </div>
            )}
            <h1 className="text-2xl font-bold text-gray-800">{profile.name}</h1>
            
            {profile.isBanned && (
              <span className="text-sm px-3 py-1 rounded-full mt-2 bg-red-100 text-red-700">
                Banlı Kullanıcı
              </span>
            )}
            
            {profile.bio && (
              <p className="text-gray-600 text-center mt-3 px-4 max-w-md">
                {profile.bio}
              </p>
            )}
            
            <span className={`text-sm px-3 py-1 rounded-full mt-3 ${
              profile.role === 'ADMIN'
                ? 'bg-purple-100 text-purple-700'
                : 'bg-rose-100 text-rose-700'
            }`}>
              {profile.role === 'ADMIN' ? 'Admin' : 'Üye'}
            </span>
          </div>

          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="bg-rose-50 rounded-lg p-4 text-center">
              <FiMessageSquare className="text-rose-500 text-2xl mx-auto mb-2" />
              <p className="text-2xl font-bold text-gray-800">{profile.questionsCount}</p>
              <p className="text-sm text-gray-500">Soru</p>
            </div>
            <div className="bg-rose-50 rounded-lg p-4 text-center">
              <FiMessageCircle className="text-rose-500 text-2xl mx-auto mb-2" />
              <p className="text-2xl font-bold text-gray-800">{profile.answersCount}</p>
              <p className="text-sm text-gray-500">Cevap</p>
            </div>
            <div className="bg-rose-50 rounded-lg p-4 text-center">
              <FiThumbsUp className="text-rose-500 text-2xl mx-auto mb-2" />
              <p className="text-2xl font-bold text-gray-800">{profile.votesReceived}</p>
              <p className="text-sm text-gray-500">Oy</p>
            </div>
          </div>

          <div className="flex items-center justify-center gap-2 text-gray-500">
            <FiCalendar />
            <span>Üyelik: {formatDate(profile.createdAt)}</span>
          </div>

          {isAdmin && user?.id !== profile.id && profile.role !== 'ADMIN' && (
            <div className="mt-6 pt-6 border-t border-gray-200 space-y-3">
              <button
                onClick={handleBanToggle}
                disabled={isBanning}
                className={`w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg font-medium transition-colors ${
                  profile.isBanned
                    ? 'bg-green-500 hover:bg-green-600 text-white'
                    : 'bg-yellow-500 hover:bg-yellow-600 text-white'
                } disabled:opacity-50`}
              >
                {isBanning ? (
                  'İşleniyor...'
                ) : profile.isBanned ? (
                  <>
                    <FiCheck />
                    Yasağı Kaldır
                  </>
                ) : (
                  <>
                    <FiSlash />
                    Kullanıcıyı Banla
                  </>
                )}
              </button>
              <button
                onClick={handleDeleteUser}
                disabled={isDeleting}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg font-medium transition-colors bg-red-500 hover:bg-red-600 text-white disabled:opacity-50"
              >
                {isDeleting ? (
                  'Siliniyor...'
                ) : (
                  <>
                    <FiTrash2 />
                    Kullanıcıyı Sil
                  </>
                )}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
