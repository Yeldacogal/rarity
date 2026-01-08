import { useState } from 'react';
import api from '../lib/api';
import { FiX } from 'react-icons/fi';

interface ReportQuestionModalProps {
  questionId: number;
  onClose: () => void;
}

const REPORT_REASONS = [
  { value: 'SPAM', label: 'Spam' },
  { value: 'HARASSMENT', label: 'Taciz' },
  { value: 'INAPPROPRIATE', label: 'Uygunsuz İçerik' },
  { value: 'MISINFORMATION', label: 'Yanlış Bilgi' },
  { value: 'OTHER', label: 'Diğer' },
];

export default function ReportQuestionModal({ questionId, onClose }: ReportQuestionModalProps) {
  const [reason, setReason] = useState('');
  const [details, setDetails] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reason) {
      setError('Lütfen bir sebep seçin');
      return;
    }

    setIsSubmitting(true);
    setError('');

    try {
      await api.post(`/questions/${questionId}/reports`, {
        reason,
        details: details || undefined,
      });
      alert('Şikayetiniz alındı. Teşekkürler!');
      onClose();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Bir hata oluştu');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
        <div className="flex items-center justify-between px-6 py-4 border-b border-rose-100">
          <h3 className="text-lg font-semibold text-gray-800">Soruyu Şikayet Et</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <FiX size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          {error && (
            <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg text-sm">
              {error}
            </div>
          )}

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Şikayet Sebebi *
            </label>
            <select
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="w-full p-3 border-2 border-rose-200 rounded-lg focus:border-rose-400 focus:outline-none"
            >
              <option value="">Seçiniz...</option>
              {REPORT_REASONS.map((r) => (
                <option key={r.value} value={r.value}>
                  {r.label}
                </option>
              ))}
            </select>
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Detaylar (Opsiyonel)
            </label>
            <textarea
              value={details}
              onChange={(e) => setDetails(e.target.value)}
              placeholder="Daha fazla bilgi ekleyebilirsiniz..."
              className="w-full p-3 border-2 border-rose-200 rounded-lg focus:border-rose-400 focus:outline-none"
              rows={3}
            />
          </div>

          <div className="flex gap-3">
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 btn-primary rounded-lg disabled:opacity-50"
            >
              {isSubmitting ? 'Gönderiliyor...' : 'Şikayet Et'}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="flex-1 btn-secondary rounded-lg"
            >
              İptal
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
