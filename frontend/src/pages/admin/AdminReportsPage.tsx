import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../lib/api';
import { Report } from '../../types';
import { FiArrowLeft, FiCheck, FiTrash2, FiExternalLink } from 'react-icons/fi';

const REASON_LABELS: Record<string, string> = {
  SPAM: 'Spam',
  HARASSMENT: 'Taciz',
  INAPPROPRIATE: 'Uygunsuz İçerik',
  MISINFORMATION: 'Yanlış Bilgi',
  OTHER: 'Diğer',
};

export default function AdminReportsPage() {
  const [reports, setReports] = useState<Report[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState<'OPEN' | 'RESOLVED' | 'ALL'>('OPEN');

  useEffect(() => {
    fetchReports();
  }, [filter]);

  const fetchReports = async () => {
    setIsLoading(true);
    try {
      const params = filter !== 'ALL' ? `?status=${filter}` : '';
      const response = await api.get<Report[]>(`/admin/reports${params}`);
      setReports(response.data);
    } catch (error) {
      console.error('Failed to fetch reports:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleResolve = async (reportId: number) => {
    try {
      await api.patch(`/admin/reports/${reportId}/resolve`);
      fetchReports();
    } catch (error) {
      console.error('Failed to resolve report:', error);
    }
  };

  const handleDeleteAnswer = async (answerId: number) => {
    if (!confirm('Bu cevabı silmek istediğinizden emin misiniz?')) return;

    try {
      await api.delete(`/admin/answers/${answerId}`);
      fetchReports();
    } catch (error) {
      console.error('Failed to delete answer:', error);
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

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <Link
        to="/admin"
        className="inline-flex items-center gap-2 text-rose-600 hover:text-rose-700 mb-6"
      >
        <FiArrowLeft />
        Admin Paneli
      </Link>

      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Şikayet Yönetimi</h1>

        <div className="flex gap-2">
          {(['OPEN', 'RESOLVED', 'ALL'] as const).map((status) => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              className={`px-3 py-1 rounded-lg text-sm transition-colors ${
                filter === status
                  ? 'bg-rose-500 text-white'
                  : 'bg-white text-rose-600 border border-rose-300 hover:border-rose-400'
              }`}
            >
              {status === 'OPEN' ? 'Açık' : status === 'RESOLVED' ? 'Çözülmüş' : 'Tümü'}
            </button>
          ))}
        </div>
      </div>

      {isLoading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-white border-2 border-rose-200 rounded-lg p-4 animate-pulse">
              <div className="h-6 bg-gray-200 rounded w-1/3 mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            </div>
          ))}
        </div>
      ) : reports.length === 0 ? (
        <div className="text-center py-12 bg-white border-2 border-rose-200 rounded-lg">
          <p className="text-gray-500">Şikayet bulunamadı.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {reports.map((report) => (
            <div
              key={report.id}
              className={`bg-white border-2 rounded-lg p-4 ${
                report.status === 'OPEN' ? 'border-red-200' : 'border-green-200'
              }`}
            >
              <div className="flex items-start justify-between mb-3">
                <div>
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    report.status === 'OPEN'
                      ? 'bg-red-100 text-red-700'
                      : 'bg-green-100 text-green-700'
                  }`}>
                    {report.status === 'OPEN' ? 'Açık' : 'Çözülmüş'}
                  </span>
                  <span className="text-xs px-2 py-1 ml-2 bg-gray-100 text-gray-700 rounded-full">
                    {REASON_LABELS[report.reason] || report.reason}
                  </span>
                </div>
                <span className="text-xs text-gray-500">{formatDate(report.createdAt)}</span>
              </div>

              <div className="mb-3">
                <p className="text-sm text-gray-500 mb-1">Şikayet Eden:</p>
                <p className="font-medium text-gray-800">{report.reporter?.name}</p>
              </div>

              <div className="mb-3 p-3 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-500 mb-1">Şikayet Edilen Cevap:</p>
                <p className="text-gray-700 line-clamp-3">{report.answer?.content}</p>
                <p className="text-xs text-gray-500 mt-2">
                  Yazan: {report.answer?.author?.name} • Soru: {report.answer?.question?.title}
                </p>
              </div>

              {report.details && (
                <div className="mb-3">
                  <p className="text-sm text-gray-500 mb-1">Detaylar:</p>
                  <p className="text-gray-700">{report.details}</p>
                </div>
              )}

              <div className="flex items-center gap-2 pt-3 border-t border-gray-100">
                <Link
                  to={`/questions/${report.answer?.questionId}`}
                  className="flex items-center gap-1 px-3 py-1 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors text-sm"
                >
                  <FiExternalLink />
                  Soruyu Gör
                </Link>

                {report.status === 'OPEN' && (
                  <>
                    <button
                      onClick={() => handleResolve(report.id)}
                      className="flex items-center gap-1 px-3 py-1 text-green-600 hover:bg-green-50 rounded-lg transition-colors text-sm"
                    >
                      <FiCheck />
                      Çözüldü
                    </button>
                    <button
                      onClick={() => handleDeleteAnswer(report.answerId)}
                      className="flex items-center gap-1 px-3 py-1 text-red-600 hover:bg-red-50 rounded-lg transition-colors text-sm"
                    >
                      <FiTrash2 />
                      Cevabı Sil
                    </button>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
