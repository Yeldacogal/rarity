import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import api from '../lib/api';
import { Question } from '../types';
import { useAuth } from '../contexts/AuthContext';
import TagSelector from '../components/TagSelector';
import ImageUpload from '../components/ImageUpload';
import { FiArrowLeft } from 'react-icons/fi';

export default function EditQuestionPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [question, setQuestion] = useState<Question | null>(null);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [selectedTags, setSelectedTags] = useState<number[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchQuestion();
  }, [id]);

  const fetchQuestion = async () => {
    try {
      const response = await api.get<Question>(`/questions/${id}`);
      const q = response.data;
      setQuestion(q);
      setTitle(q.title);
      setContent(q.content);
      setImageUrl(q.imageUrl || '');
      setSelectedTags(q.tags?.map((t) => t.id) || []);
    } catch (error) {
      console.error('Failed to fetch question:', error);
      navigate('/questions');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    try {
      await api.patch(`/questions/${id}`, {
        title,
        content,
        imageUrl: imageUrl || undefined,
      });

      await api.put(`/questions/${id}/tags`, { tagIds: selectedTags });

      navigate(`/questions/${id}`);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Soru güncellenemedi');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/2 mb-8"></div>
          <div className="h-12 bg-gray-200 rounded w-full mb-4"></div>
          <div className="h-32 bg-gray-200 rounded w-full mb-4"></div>
        </div>
      </div>
    );
  }

  if (!question) {
    return null;
  }

  const isOwner = user?.id === question.authorId;
  const isAdmin = user?.role === 'ADMIN';
  if (!isOwner && !isAdmin) {
    navigate('/questions');
    return null;
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <Link
        to={`/questions/${id}`}
        className="inline-flex items-center gap-2 text-rose-600 hover:text-rose-700 mb-6"
      >
        <FiArrowLeft />
        Soruya Dön
      </Link>

      <div className="window">
        <div className="window-header">
          <div className="flex gap-2">
            <div className="w-3 h-3 bg-red-400 rounded-full"></div>
            <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
            <div className="w-3 h-3 bg-green-400 rounded-full"></div>
          </div>
          <span>edit_question.exe</span>
          <div className="w-16"></div>
        </div>

        <div className="window-content">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Soruyu Düzenle</h2>

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
                {isSubmitting ? 'Kaydediliyor...' : 'Kaydet'}
              </button>
              <Link
                to={`/questions/${id}`}
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
