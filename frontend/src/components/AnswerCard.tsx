import { useState, useEffect } from 'react';
import { Answer } from '../types';
import { useAuth } from '../contexts/AuthContext';
import api from '../lib/api';
import { FiThumbsUp, FiFlag, FiEdit2, FiTrash2, FiUser, FiClock, FiMessageCircle, FiCornerDownRight, FiBookmark } from 'react-icons/fi';
import ReportModal from './ReportModal';

interface AnswerCardProps {
  answer: Answer;
  questionId: number;
  onUpdate: () => void;
  isReply?: boolean;
}

export default function AnswerCard({ answer, questionId, onUpdate, isReply = false }: AnswerCardProps) {
  const { user, isBanned } = useAuth();
  const [isVoting, setIsVoting] = useState(false);
  const [hasVoted, setHasVoted] = useState(false);
  const [voteCount, setVoteCount] = useState(answer.voteCount || 0);
  const [showReportModal, setShowReportModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(answer.content);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showReplyForm, setShowReplyForm] = useState(false);
  const [replyContent, setReplyContent] = useState('');
  const [isSubmittingReply, setIsSubmittingReply] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);

  const isOwner = user?.id === answer.authorId;
  const isAdmin = user?.role === 'ADMIN';
  const canEdit = isOwner || isAdmin;

  useEffect(() => {
    if (user) {
      checkBookmark();
    }
  }, [user, answer.id]);

  const checkBookmark = async () => {
    try {
      const response = await api.get(`/bookmarks/answers/${answer.id}`);
      setIsBookmarked(response.data.bookmarked);
    } catch (error) {
    }
  };

  const toggleBookmark = async () => {
    if (!user) return;
    try {
      const response = await api.post(`/bookmarks/answers/${answer.id}`);
      setIsBookmarked(response.data.bookmarked);
    } catch (error) {
      console.error('Bookmark error:', error);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('tr-TR', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const handleVote = async () => {
    if (!user || isBanned) return;
    
    setIsVoting(true);
    try {
      const response = await api.post(`/answers/${answer.id}/votes`);
      setHasVoted(response.data.voted);
      setVoteCount((prev) => response.data.voted ? prev + 1 : prev - 1);
    } catch (error) {
      console.error('Vote error:', error);
    } finally {
      setIsVoting(false);
    }
  };

  const handleEdit = async () => {
    try {
      await api.patch(`/answers/${answer.id}`, { content: editContent });
      setIsEditing(false);
      onUpdate();
    } catch (error) {
      console.error('Edit error:', error);
    }
  };

  const handleDelete = async () => {
    if (!confirm('Bu cevabı silmek istediğinizden emin misiniz?')) return;
    
    setIsDeleting(true);
    try {
      await api.delete(`/answers/${answer.id}`);
      onUpdate();
    } catch (error) {
      console.error('Delete error:', error);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleReply = async () => {
    if (!replyContent.trim()) return;
    
    setIsSubmittingReply(true);
    try {
      await api.post(`/questions/${questionId}/answers`, {
        content: replyContent.trim(),
        parentId: answer.id,
      });
      setReplyContent('');
      setShowReplyForm(false);
      onUpdate();
    } catch (error) {
      console.error('Reply error:', error);
    } finally {
      setIsSubmittingReply(false);
    }
  };

  return (
    <div className={`bg-white border-2 ${isReply ? 'border-rose-50 ml-8' : 'border-rose-100'} rounded-lg p-4 hover:border-rose-200 transition-colors`}>
      {isReply && (
        <div className="flex items-center gap-1 text-xs text-gray-400 mb-2">
          <FiCornerDownRight />
          <span>Yanıt</span>
        </div>
      )}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2 text-sm text-gray-500">
          {answer.author?.avatarUrl ? (
            <img
              src={answer.author.avatarUrl}
              alt=""
              className="w-6 h-6 rounded-full object-cover"
            />
          ) : (
            <FiUser className="text-rose-400" />
          )}
          <span className="font-medium text-gray-700">{answer.author?.name || 'Anonim'}</span>
          <span>•</span>
          <FiClock className="text-rose-400" />
          <span>{formatDate(answer.createdAt)}</span>
        </div>
        
        {canEdit && !isEditing && (
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsEditing(true)}
              className="text-gray-400 hover:text-blue-500 transition-colors"
              title="Düzenle"
            >
              <FiEdit2 />
            </button>
            <button
              onClick={handleDelete}
              disabled={isDeleting}
              className="text-gray-400 hover:text-red-500 transition-colors"
              title="Sil"
            >
              <FiTrash2 />
            </button>
          </div>
        )}
      </div>

      {isEditing ? (
        <div className="mb-3">
          <textarea
            value={editContent}
            onChange={(e) => setEditContent(e.target.value)}
            className="w-full p-3 border-2 border-rose-200 rounded-lg focus:border-rose-400 focus:outline-none"
            rows={4}
          />
          <div className="flex gap-2 mt-2">
            <button
              onClick={handleEdit}
              className="px-4 py-2 bg-rose-500 text-white rounded-lg hover:bg-rose-600 transition-colors"
            >
              Kaydet
            </button>
            <button
              onClick={() => {
                setIsEditing(false);
                setEditContent(answer.content);
              }}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
            >
              İptal
            </button>
          </div>
        </div>
      ) : (
        <p className="text-gray-700 mb-3 whitespace-pre-wrap">{answer.content}</p>
      )}

      <div className="flex items-center gap-4 pt-3 border-t border-rose-100">
        <button
          onClick={handleVote}
          disabled={!user || isBanned || isVoting}
          className={`flex items-center gap-1 px-3 py-1 rounded-lg transition-colors ${
            hasVoted
              ? 'bg-rose-500 text-white'
              : 'bg-rose-100 text-rose-600 hover:bg-rose-200'
          } ${(!user || isBanned) ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          <FiThumbsUp />
          <span>{voteCount}</span>
        </button>

        {user && !isBanned && !isOwner && (
          <button
            onClick={() => setShowReportModal(true)}
            className="flex items-center gap-1 px-3 py-1 text-gray-500 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
          >
            <FiFlag />
            <span>Şikayet Et</span>
          </button>
        )}

        {user && (
          <button
            onClick={toggleBookmark}
            className={`flex items-center gap-1 px-3 py-1 rounded-lg transition-colors ${
              isBookmarked
                ? 'text-yellow-500 bg-yellow-50'
                : 'text-gray-500 hover:text-yellow-500 hover:bg-yellow-50'
            }`}
            title={isBookmarked ? 'Favorilerden Çıkar' : 'Favorilere Ekle'}
          >
            <FiBookmark className={isBookmarked ? 'fill-current' : ''} />
          </button>
        )}

        {user && !isBanned && !isReply && (
          <button
            onClick={() => setShowReplyForm(!showReplyForm)}
            className="flex items-center gap-1 px-3 py-1 text-gray-500 hover:text-rose-500 hover:bg-rose-50 rounded-lg transition-colors"
          >
            <FiMessageCircle />
            <span>Yanıtla</span>
          </button>
        )}
      </div>

      {showReplyForm && (
        <div className="mt-4 pt-4 border-t border-rose-100">
          <textarea
            value={replyContent}
            onChange={(e) => setReplyContent(e.target.value)}
            placeholder="Yanıtınızı yazın..."
            className="w-full p-3 border-2 border-rose-200 rounded-lg focus:border-rose-400 focus:outline-none"
            rows={3}
          />
          <div className="flex gap-2 mt-2">
            <button
              onClick={handleReply}
              disabled={isSubmittingReply || !replyContent.trim()}
              className="px-4 py-2 bg-rose-500 text-white rounded-lg hover:bg-rose-600 transition-colors disabled:opacity-50"
            >
              {isSubmittingReply ? 'Gönderiliyor...' : 'Yanıtla'}
            </button>
            <button
              onClick={() => {
                setShowReplyForm(false);
                setReplyContent('');
              }}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
            >
              İptal
            </button>
          </div>
        </div>
      )}

      {!isReply && answer.replies && answer.replies.length > 0 && (
        <div className="mt-4 space-y-3">
          {answer.replies.map((reply) => (
            <AnswerCard
              key={reply.id}
              answer={reply}
              questionId={questionId}
              onUpdate={onUpdate}
              isReply={true}
            />
          ))}
        </div>
      )}

      {showReportModal && (
        <ReportModal
          answerId={answer.id}
          onClose={() => setShowReportModal(false)}
        />
      )}
    </div>
  );
}
