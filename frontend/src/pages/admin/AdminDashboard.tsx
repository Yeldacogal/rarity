import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../lib/api';
import { FiUsers, FiAlertTriangle, FiTag, FiMessageSquare, FiFolder } from 'react-icons/fi';

interface Stats {
  openReports: number;
  totalReports: number;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await api.get<Stats>('/admin/stats');
      setStats(response.data);
    } catch (error) {
      console.error('Failed to fetch stats:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-800 mb-8">Admin Paneli</h1>

      {!isLoading && stats && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white border-2 border-rose-200 rounded-lg p-4 text-center">
            <FiAlertTriangle className="text-red-500 text-2xl mx-auto mb-2" />
            <p className="text-2xl font-bold text-gray-800">{stats.openReports}</p>
            <p className="text-sm text-gray-500">Açık Şikayet</p>
          </div>
          <div className="bg-white border-2 border-rose-200 rounded-lg p-4 text-center">
            <FiMessageSquare className="text-rose-500 text-2xl mx-auto mb-2" />
            <p className="text-2xl font-bold text-gray-800">{stats.totalReports}</p>
            <p className="text-sm text-gray-500">Toplam Şikayet</p>
          </div>
        </div>
      )}

      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Link
          to="/admin/users"
          className="bg-white border-2 border-rose-200 rounded-lg p-6 hover:border-rose-400 hover:shadow-lg transition-all"
        >
          <FiUsers className="text-rose-500 text-3xl mb-4" />
          <h3 className="text-lg font-semibold text-gray-800 mb-2">Kullanıcılar</h3>
          <p className="text-sm text-gray-500">Kullanıcıları yönet, ban/unban işlemleri yap.</p>
        </Link>

        <Link
          to="/admin/reports"
          className="bg-white border-2 border-rose-200 rounded-lg p-6 hover:border-rose-400 hover:shadow-lg transition-all relative"
        >
          {stats && stats.openReports > 0 && (
            <span className="absolute top-4 right-4 bg-red-500 text-white text-xs px-2 py-1 rounded-full">
              {stats.openReports}
            </span>
          )}
          <FiAlertTriangle className="text-rose-500 text-3xl mb-4" />
          <h3 className="text-lg font-semibold text-gray-800 mb-2">Şikayetler</h3>
          <p className="text-sm text-gray-500">Kullanıcı şikayetlerini görüntüle ve çöz.</p>
        </Link>

        <Link
          to="/admin/categories"
          className="bg-white border-2 border-rose-200 rounded-lg p-6 hover:border-rose-400 hover:shadow-lg transition-all"
        >
          <FiFolder className="text-rose-500 text-3xl mb-4" />
          <h3 className="text-lg font-semibold text-gray-800 mb-2">Kategoriler</h3>
          <p className="text-sm text-gray-500">Ana kategorileri oluştur ve yönet.</p>
        </Link>

        <Link
          to="/admin/tags"
          className="bg-white border-2 border-rose-200 rounded-lg p-6 hover:border-rose-400 hover:shadow-lg transition-all"
        >
          <FiTag className="text-rose-500 text-3xl mb-4" />
          <h3 className="text-lg font-semibold text-gray-800 mb-2">Etiketler</h3>
          <p className="text-sm text-gray-500">Etiketleri oluştur, düzenle veya sil.</p>
        </Link>
      </div>
    </div>
  );
}
