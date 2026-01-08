import { Link } from 'react-router-dom';
import { Question } from '../types';
import { FiMessageCircle, FiClock, FiUser, FiImage } from 'react-icons/fi';

interface QuestionCardProps {
  question: Question;
}

export default function QuestionCard({ question }: QuestionCardProps) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('tr-TR', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  };

  return (
    <Link
      to={`/questions/${question.id}`}
      className="block bg-white border-2 border-rose-200 rounded-lg p-4 hover:border-rose-400 hover:shadow-lg transition-all"
    >
      <div className="flex gap-4">
        {question.imageUrl && (
          <div className="shrink-0">
            <img
              src={question.imageUrl}
              alt=""
              className="w-20 h-20 object-cover rounded-lg border border-rose-200"
            />
          </div>
        )}
        
        <div className="flex-1 min-w-0">
          <h3 className="text-lg font-semibold text-gray-800 mb-2 hover:text-rose-600 transition-colors">
            {question.title}
          </h3>
          
          <p className="text-gray-600 text-sm mb-3 line-clamp-2">
            {question.content}
          </p>

          {question.tags && question.tags.length > 0 && (
            <div className="flex flex-wrap gap-1 mb-3">
              {question.tags.map((tag) => (
                <span
                  key={tag.id}
                  className="inline-block bg-rose-100 text-rose-700 text-xs px-2 py-1 rounded"
                >
                  {tag.name}
                </span>
              ))}
            </div>
          )}

          <div className="flex items-center justify-between text-xs text-gray-400">
            <div className="flex items-center gap-3">
              <span className="flex items-center gap-1">
                {question.author?.avatarUrl ? (
                  <img
                    src={question.author.avatarUrl}
                    alt=""
                    className="w-5 h-5 rounded-full object-cover"
                  />
                ) : (
                  <FiUser />
                )}
                {question.author?.name || 'Anonim'}
              </span>
              <span className="flex items-center gap-1">
                <FiClock />
                {formatDate(question.createdAt)}
              </span>
              {question.imageUrl && (
                <span className="flex items-center gap-1 text-rose-400">
                  <FiImage />
                </span>
              )}
            </div>
            <span className="flex items-center gap-1 text-rose-500">
              <FiMessageCircle />
              {question.answerCount || question.answers?.length || 0} cevap
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}
