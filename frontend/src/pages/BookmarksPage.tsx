import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../lib/api';
import { Question, Answer } from '../types';
import QuestionCard from '../components/QuestionCard';
import { FiBookmark, FiMessageSquare, FiMessageCircle, FiUser, FiClock } from 'react-icons/fi';

interface BookmarkItem {
  id: number;
  type: 'question' | 'answer';
  question?: Question;
  answer?: Answer & { question?: Question };
  bookmarkedAt: string;
}

type TabType = 'all' | 'questions' | 'answers';

export default function BookmarksPage() {
  const [bookmarks, setBookmarks] = useState<BookmarkItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<TabType>('all');

  useEffect(() => {
    fetchBookmarks();
  }, [activeTab]);

  const fetchBookmarks = async () => {
    setIsLoading(true);
    try {
      const params = activeTab !== 'all' ? `?type=${activeTab}` : '';
      const response = await api.get<BookmarkItem[]>(`/bookmarks${params}`);
      setBookmarks(response.data);
    } catch (error) {
      console.error('Failed to fetch bookmarks:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('tr-TR', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  };

  const tabs: { key: TabType; label: string; icon: React.ReactNode }[] = [
    { key: 'all', label: 'Tümü', icon: <FiBookmark /> },
    { key: 'questions', label: 'Sorular', icon: <FiMessageSquare /> },
    { key: 'answers', label: 'Cevaplar', icon: <FiMessageCircle /> },
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2 mb-6">
        <FiBookmark className="text-rose-500" />
        Favorilerim
      </h1>

      <div className="flex gap-2 mb-6 border-b border-rose-200 pb-4">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
              activeTab === tab.key
                ? 'bg-rose-500 text-white'
                : 'bg-rose-50 text-rose-600 hover:bg-rose-100'
            }`}
          >
            {tab.icon}
            {tab.label}
          </button>
        ))}
      </div>

      {isLoading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-white border-2 border-rose-200 rounded-lg p-4 animate-pulse">
              <div className="h-6 bg-gray-200 rounded w-3/4 mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            </div>
          ))}
        </div>
      ) : bookmarks.length === 0 ? (
        <div className="text-center py-12 bg-white border-2 border-rose-200 rounded-lg">
          <FiBookmark className="text-4xl text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500 mb-4">
            {activeTab === 'questions' && 'Henüz favori sorunuz yok.'}
            {activeTab === 'answers' && 'Henüz favori cevabınız yok.'}
            {activeTab === 'all' && 'Henüz favoriniz yok.'}
          </p>
          <Link
            to="/questions"
            className="text-rose-600 hover:text-rose-700"
          >
            Soruları keşfet →
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {bookmarks.map((bookmark) => (
            bookmark.type === 'question' && bookmark.question ? (
              <QuestionCard key={`q-${bookmark.question.id}`} question={bookmark.question} />
            ) : bookmark.type === 'answer' && bookmark.answer ? (
              <Link
                key={`a-${bookmark.answer.id}`}
                to={`/questions/${bookmark.answer.question?.id}`}
                className="block bg-white border-2 border-rose-200 rounded-lg p-4 hover:border-rose-400 hover:shadow-lg transition-all"
              >
                <div className="flex items-center gap-2 text-xs text-rose-500 mb-2">
                  <FiMessageCircle />
                  <span>Favori Cevap</span>
                </div>
                <p className="text-gray-700 line-clamp-3 mb-3">{bookmark.answer.content}</p>
                <div className="flex items-center justify-between text-xs text-gray-400">
                  <div className="flex items-center gap-3">
                    <span className="flex items-center gap-1">
                      {bookmark.answer.author?.avatarUrl ? (
                        <img
                          src={bookmark.answer.author.avatarUrl}
                          alt=""
                          className="w-5 h-5 rounded-full object-cover"
                        />
                      ) : (
                        <FiUser />
                      )}
                      {bookmark.answer.author?.name || 'Anonim'}
                    </span>
                    <span className="flex items-center gap-1">
                      <FiClock />
                      {formatDate(bookmark.answer.createdAt)}
                    </span>
                  </div>
                  {bookmark.answer.question && (
                    <span className="text-rose-500 truncate max-w-[200px]">
                      {bookmark.answer.question.title}
                    </span>
                  )}
                </div>
              </Link>
            ) : null
          ))}
        </div>
      )}
    </div>
  );
}
