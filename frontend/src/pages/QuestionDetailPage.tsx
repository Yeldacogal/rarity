import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import api from '../lib/api';
import { Question } from '../types';
import { useAuth } from '../contexts/AuthContext';
import AnswerCard from '../components/AnswerCard';
import { FiUser, FiClock, FiEdit2, FiTrash2, FiArrowLeft, FiBookmark, FiFlag } from 'react-icons/fi';
import ReportQuestionModal from '../components/ReportQuestionModal';

export default function QuestionDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user, isBanned } = useAuth();
  const [question, setQuestion] = useState<Question | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [answerContent, setAnswerContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);

  const isOwner = user?.id === question?.authorId;
  const isAdmin = user?.role === 'ADMIN';
  const canEdit = isOwner || isAdmin;

  useEffect(() => {
    fetchQuestion();
  }, [id]);

  useEffect(() => {
    if (user && id) {
      checkBookmark();
    }
  }, [user, id]);

  const fetchQuestion = async () => {
    try {
      const response = await api.get<Question>(`/questions/${id}`);
      setQuestion(response.data);
    } catch (error) {
      console.error('Failed to fetch question:', error);
      navigate('/questions');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmitAnswer = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!answerContent.trim() || isBanned) return;

    setIsSubmitting(true);
    try {
      await api.post(`/questions/${id}/answers`, { content: answerContent });
      setAnswerContent('');
      fetchQuestion();
    } catch (error: any) {
      alert(error.response?.data?.message || 'Cevap gönderilemedi');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteQuestion = async () => {
    if (!confirm('Bu soruyu silmek istediğinizden emin misiniz?')) return;

    try {
      await api.delete(`/questions/${id}`);
      navigate('/questions');
    } catch (error) {
      console.error('Failed to delete question:', error);
    }
  };

  const checkBookmark = async () => {
    try {
      const response = await api.get(`/bookmarks/questions/${id}`);
      setIsBookmarked(response.data.bookmarked);
    } catch (error) {
      console.error('Failed to check bookmark:', error);
    }
  };

  const toggleBookmark = async () => {
    if (!user) return;
    try {
      const response = await api.post(`/bookmarks/questions/${id}`);
      setIsBookmarked(response.data.bookmarked);
    } catch (error) {
      console.error('Failed to toggle bookmark:', error);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('tr-TR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-3/4 mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
        </div>
      </div>
    );
  }

  if (!question) {
    return null;
  }

  return (
    <div className="min-h-screen relative" style={{ backgroundImage: 'url(/bg-pattern.jpg)', backgroundSize: 'cover', backgroundPosition: 'center', backgroundAttachment: 'fixed' }}>
      <div className="absolute inset-0 bg-white/70"></div>
      <div className="relative max-w-4xl mx-auto px-4 py-8">
      <Link
        to="/questions"
        className="inline-flex items-center gap-2 text-rose-600 hover:text-rose-700 mb-6"
      >
        <FiArrowLeft />
        Sorulara Dön
      </Link>

      <div className="bg-white border-2 border-rose-200 rounded-lg p-6 mb-8">
        <div className="flex items-start justify-between mb-4">
          <h1 className="text-2xl font-bold text-gray-800">{question.title}</h1>
          <div className="flex items-center gap-2">
            {user && (
              <>
                <button
                  onClick={toggleBookmark}
                  className={`p-2 transition-colors ${
                    isBookmarked
                      ? 'text-yellow-500 hover:text-yellow-600'
                      : 'text-gray-400 hover:text-yellow-500'
                  }`}
                  title={isBookmarked ? 'Favorilerden Çıkar' : 'Favorilere Ekle'}
                >
                  <FiBookmark className={isBookmarked ? 'fill-current' : ''} />
                </button>
                {!isOwner && !isBanned && (
                  <button
                    onClick={() => setShowReportModal(true)}
                    className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                    title="Şikayet Et"
                  >
                    <FiFlag />
                  </button>
                )}
              </>
            )}
            {canEdit && (
              <>
                <Link
                  to={`/questions/${id}/edit`}
                  className="p-2 text-gray-400 hover:text-blue-500 transition-colors"
                  title="Düzenle"
                >
                  <FiEdit2 />
                </Link>
                <button
                  onClick={handleDeleteQuestion}
                  className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                  title="Sil"
                >
                  <FiTrash2 />
                </button>
              </>
            )}
          </div>
        </div>

        {question.tags && question.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {question.tags.map((tag) => (
              <span
                key={tag.id}
                className="inline-block bg-rose-100 text-rose-700 text-sm px-3 py-1 rounded-lg"
              >
                {tag.name}
              </span>
            ))}
          </div>
        )}

        <p className="text-gray-700 whitespace-pre-wrap mb-6">{question.content}</p>

        {question.imageUrl && (
          <div className="mb-6">
            <img
              src={question.imageUrl}
              alt="Soru görseli"
              className="max-w-full max-h-96 rounded-lg border border-rose-200 object-contain"
            />
          </div>
        )}

        <div className="flex items-center gap-4 text-sm text-gray-500 pt-4 border-t border-rose-100">
          <Link
            to={`/profile/${question.author?.id}`}
            className="flex items-center gap-2 hover:text-rose-600 transition-colors"
          >
            {question.author?.avatarUrl ? (
              <img
                src={question.author.avatarUrl}
                alt=""
                className="w-8 h-8 rounded-full object-cover border border-rose-200"
              />
            ) : (
              <div className="w-8 h-8 bg-rose-200 rounded-full flex items-center justify-center">
                <FiUser className="text-rose-600" />
              </div>
            )}
            <span className="font-medium">{question.author?.name || 'Anonim'}</span>
          </Link>
          <span className="flex items-center gap-1">
            <FiClock />
            {formatDate(question.createdAt)}
          </span>
        </div>
      </div>

      <div className="mb-8">
        <h2 className="text-xl font-bold text-gray-800 mb-4">
          Cevaplar ({question.answers?.length || 0})
        </h2>

        {question.answers && question.answers.length > 0 ? (
          <div className="space-y-4">
            {question.answers.map((answer) => (
              <AnswerCard
                key={answer.id}
                answer={answer}
                questionId={question.id}
                onUpdate={fetchQuestion}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-8 bg-white border-2 border-rose-200 rounded-lg">
            <p className="text-gray-500">Henüz cevap yok. İlk cevabı sen ver!</p>
          </div>
        )}
      </div>

      {user ? (
        isBanned ? (
          <div className="bg-red-50 border-2 border-red-200 rounded-lg p-6 text-center">
            <p className="text-red-600">Hesabınız askıya alındığı için cevap yazamazsınız.</p>
          </div>
        ) : (
          <div className="bg-white border-2 border-rose-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Cevap Yaz</h3>
            <form onSubmit={handleSubmitAnswer}>
              <textarea
                value={answerContent}
                onChange={(e) => setAnswerContent(e.target.value)}
                placeholder="Cevabınızı yazın..."
                className="w-full p-4 border-2 border-rose-200 rounded-lg focus:border-rose-400 focus:outline-none mb-4"
                rows={4}
                required
              />
              <button
                type="submit"
                disabled={isSubmitting || !answerContent.trim()}
                className="btn-primary rounded-lg disabled:opacity-50"
              >
                {isSubmitting ? 'Gönderiliyor...' : 'Cevap Gönder'}
              </button>
            </form>
          </div>
        )
      ) : (
        <div className="bg-rose-50 border-2 border-rose-200 rounded-lg p-6 text-center">
          <p className="text-gray-600 mb-4">Cevap yazmak için giriş yapmalısınız.</p>
          <Link to="/login" className="btn-primary rounded-lg inline-block">
            Giriş Yap
          </Link>
        </div>
      )}

      {showReportModal && (
        <ReportQuestionModal
          questionId={question.id}
          onClose={() => setShowReportModal(false)}
        />
      )}
      </div>
    </div>
  );
}
