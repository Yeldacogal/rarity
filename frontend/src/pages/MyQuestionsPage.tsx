import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../lib/api';
import { Question } from '../types';
import QuestionCard from '../components/QuestionCard';
import { FiPlus } from 'react-icons/fi';

export default function MyQuestionsPage() {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchMyQuestions();
  }, []);

  const fetchMyQuestions = async () => {
    try {
      const response = await api.get<Question[]>('/questions/my');
      setQuestions(response.data);
    } catch (error) {
      console.error('Failed to fetch questions:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold text-gray-800">Sorularım</h1>
        <Link
          to="/questions/new"
          className="btn-primary rounded-lg flex items-center gap-2"
        >
          <FiPlus />
          Soru Sor
        </Link>
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
      ) : questions.length === 0 ? (
        <div className="text-center py-12 bg-white border-2 border-rose-200 rounded-lg">
          <p className="text-gray-500 mb-4">Henüz soru sormadınız.</p>
          <Link
            to="/questions/new"
            className="btn-primary rounded-lg inline-flex items-center gap-2"
          >
            <FiPlus />
            İlk Soruyu Sor
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {questions.map((question) => (
            <QuestionCard key={question.id} question={question} />
          ))}
        </div>
      )}
    </div>
  );
}
