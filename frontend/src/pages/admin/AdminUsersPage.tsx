import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../lib/api';
import { User } from '../../types';
import { FiArrowLeft, FiUser, FiShield, FiTrash2, FiExternalLink } from 'react-icons/fi';

export default function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await api.get<User[]>('/users');
      setUsers(response.data);
    } catch (error) {
      console.error('Failed to fetch users:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleBanToggle = async (userId: number) => {
    try {
      await api.patch(`/users/${userId}/ban`);
      fetchUsers();
    } catch (error) {
      console.error('Failed to toggle ban:', error);
    }
  };

  const handleDelete = async (userId: number) => {
    if (!confirm('Bu kullanıcıyı silmek istediğinizden emin misiniz? Bu işlem geri alınamaz.')) {
      return;
    }

    try {
      await api.delete(`/users/${userId}`);
      fetchUsers();
    } catch (error) {
      console.error('Failed to delete user:', error);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('tr-TR');
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

      <h1 className="text-2xl font-bold text-gray-800 mb-6">Kullanıcı Yönetimi</h1>

      {isLoading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-white border-2 border-rose-200 rounded-lg p-4 animate-pulse">
              <div className="h-6 bg-gray-200 rounded w-1/3 mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white border-2 border-rose-200 rounded-lg overflow-hidden">
          <table className="w-full">
            <thead className="bg-rose-50">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Kullanıcı</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">E-posta</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Rol</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Durum</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Kayıt</th>
                <th className="px-4 py-3 text-center text-sm font-semibold text-gray-700">İşlemler</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-rose-100">
              {users.map((user) => (
                <tr key={user.id} className="hover:bg-rose-50">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 bg-rose-200 rounded-full flex items-center justify-center">
                        <FiUser className="text-rose-600" />
                      </div>
                      <Link 
                        to={`/profile/${user.id}`}
                        className="font-medium text-gray-800 hover:text-rose-600 hover:underline flex items-center gap-1"
                      >
                        {user.name}
                        <FiExternalLink className="text-xs" />
                      </Link>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-gray-600">{user.email}</td>
                  <td className="px-4 py-3">
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      user.role === 'ADMIN'
                        ? 'bg-purple-100 text-purple-700'
                        : 'bg-rose-100 text-rose-700'
                    }`}>
                      {user.role}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      user.isBanned
                        ? 'bg-red-100 text-red-700'
                        : 'bg-green-100 text-green-700'
                    }`}>
                      {user.isBanned ? 'Banlı' : 'Aktif'}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-gray-500 text-sm">{formatDate(user.createdAt)}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-center gap-2">
                      {user.role !== 'ADMIN' && (
                        <>
                          <button
                            onClick={() => handleBanToggle(user.id)}
                            className={`p-2 rounded-lg transition-colors ${
                              user.isBanned
                                ? 'text-green-600 hover:bg-green-50'
                                : 'text-yellow-600 hover:bg-yellow-50'
                            }`}
                            title={user.isBanned ? 'Banı Kaldır' : 'Banla'}
                          >
                            <FiShield />
                          </button>
                          <button
                            onClick={() => handleDelete(user.id)}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            title="Sil"
                          >
                            <FiTrash2 />
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
