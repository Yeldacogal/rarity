import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../lib/api';
import { useAuth } from '../contexts/AuthContext';
import TagSelector from '../components/TagSelector';
import ImageUpload from '../components/ImageUpload';
import { FiArrowLeft } from 'react-icons/fi';

export default function CreateQuestionPage() {
  const navigate = useNavigate();
  const { isBanned } = useAuth();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [selectedTags, setSelectedTags] = useState<number[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  if (isBanned) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-8">
        <div className="bg-red-50 border-2 border-red-200 rounded-lg p-6 text-center">
          <h2 className="text-xl font-bold text-red-600 mb-2">Erişim Engellendi</h2>
          <p className="text-red-600">Hesabınız askıya alındığı için soru soramazsınız.</p>
        </div>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    try {
      const response = await api.post('/questions', {
        title,
        content,
        imageUrl: imageUrl || undefined,
        tagIds: selectedTags,
      });
      navigate(`/questions/${response.data.id}`);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Soru oluşturulamadı');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen relative" style={{ backgroundImage: 'url(/bg-pattern.jpg)', backgroundSize: 'cover', backgroundPosition: 'center', backgroundAttachment: 'fixed' }}>
      <div className="absolute inset-0 bg-white/70"></div>
      <div className="relative max-w-2xl mx-auto px-4 py-8">
      <Link
        to="/questions"
        className="inline-flex items-center gap-2 text-rose-600 hover:text-rose-700 mb-6"
      >
        <FiArrowLeft />
        Sorulara Dön
      </Link>

      <div className="relative">
        <img 
          src="/sleeping-cat.gif" 
          alt="" 
          className="absolute -top-16 left-1/2 -translate-x-1/2 w-24 h-auto z-10"
        />
        
        <div className="window">
          <div className="window-header">
          <div className="flex gap-2">
            <div className="w-3 h-3 bg-red-400 rounded-full"></div>
            <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
            <div className="w-3 h-3 bg-green-400 rounded-full"></div>
          </div>
          <span>new_question.exe</span>
          <div className="w-16"></div>
        </div>

        <div className="window-content">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Yeni Soru Sor</h2>

          {error && (
            <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Başlık *
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Sorunuzun başlığı"
                className="w-full p-3 border-2 border-rose-200 rounded-lg focus:border-rose-400 focus:outline-none"
                required
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Detay *
              </label>
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Sorunuzu detaylı açıklayın..."
                className="w-full p-3 border-2 border-rose-200 rounded-lg focus:border-rose-400 focus:outline-none"
                rows={6}
                required
              />
            </div>

            <div className="mb-4">
              <ImageUpload
                currentImage={imageUrl}
                onImageUploaded={(url) => setImageUrl(url)}
                onImageRemoved={() => setImageUrl('')}
                label="Görsel (Opsiyonel)"
              />
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Etiketler
              </label>
              <TagSelector selectedTags={selectedTags} onChange={setSelectedTags} />
            </div>

            <div className="flex gap-4">
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 btn-primary rounded-lg"
              >
                {isSubmitting ? 'Gönderiliyor...' : 'Soruyu Gönder'}
              </button>
              <Link
                to="/questions"
                className="flex-1 btn-secondary rounded-lg text-center"
              >
                İptal
              </Link>
            </div>
          </form>
        </div>
      </div>
      </div>
      </div>
    </div>
  );
}
