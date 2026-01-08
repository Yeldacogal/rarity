import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import api from '../lib/api';
import { FiArrowLeft, FiUser, FiSave } from 'react-icons/fi';
import ImageUpload from '../components/ImageUpload';

export default function EditProfilePage() {
  const navigate = useNavigate();
  const { user, refreshUser } = useAuth();
  const [name, setName] = useState(user?.name || '');
  const [avatarUrl, setAvatarUrl] = useState(user?.avatarUrl || '');
  const [bio, setBio] = useState(user?.bio || '');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  if (!user) {
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    try {
      await api.patch('/users/me', {
        name: name.trim(),
        avatarUrl: avatarUrl.trim() || null,
        bio: bio.trim() || null,
      });
      await refreshUser();
      navigate('/profile');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Profil güncellenemedi');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <Link
        to="/profile"
        className="inline-flex items-center gap-2 text-rose-600 hover:text-rose-700 mb-6"
      >
        <FiArrowLeft />
        Profile Dön
      </Link>

      <div className="window">
        <div className="window-header">
          <div className="flex gap-2">
            <div className="w-3 h-3 bg-red-400 rounded-full"></div>
            <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
            <div className="w-3 h-3 bg-green-400 rounded-full"></div>
          </div>
          <span>edit_profile.exe</span>
          <div className="w-16"></div>
        </div>

        <div className="window-content">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Profili Düzenle</h2>

          <div className="flex justify-center mb-6">
            {avatarUrl ? (
              <img
                src={avatarUrl}
                alt="Avatar"
                className="w-24 h-24 rounded-full object-cover border-4 border-rose-200"
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = 'none';
                }}
              />
            ) : (
              <div className="w-24 h-24 bg-gradient-to-br from-rose-400 to-rose-600 rounded-full flex items-center justify-center">
                <FiUser className="text-white text-4xl" />
              </div>
            )}
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                İsim *
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="İsminiz"
                className="w-full p-3 border-2 border-rose-200 rounded-lg focus:border-rose-400 focus:outline-none"
                required
              />
            </div>

            <div className="mb-4">
              <ImageUpload
                currentImage={avatarUrl}
                onImageUploaded={(url) => setAvatarUrl(url)}
                onImageRemoved={() => setAvatarUrl('')}
                label="Profil Fotoğrafı (Opsiyonel)"
              />
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Hakkımda (Opsiyonel)
              </label>
              <textarea
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                placeholder="Kendinizden biraz bahsedin..."
                className="w-full p-3 border-2 border-rose-200 rounded-lg focus:border-rose-400 focus:outline-none"
                rows={4}
                maxLength={500}
              />
              <p className="text-xs text-gray-500 mt-1">
                {bio.length}/500 karakter
              </p>
            </div>

            <div className="flex gap-4">
              <button
                type="submit"
                disabled={isSubmitting || !name.trim()}
                className="flex-1 btn-primary rounded-lg flex items-center justify-center gap-2 disabled:opacity-50"
              >
                <FiSave />
                {isSubmitting ? 'Kaydediliyor...' : 'Kaydet'}
              </button>
              <Link
                to="/profile"
                className="flex-1 btn-secondary rounded-lg text-center"
              >
                İptal
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
