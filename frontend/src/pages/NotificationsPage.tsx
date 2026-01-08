import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../lib/api';
import { Notification } from '../types';
import { FiBell, FiCheck, FiCheckCircle, FiTrash2, FiMessageSquare, FiThumbsUp, FiMessageCircle } from 'react-icons/fi';

type TabType = 'all' | 'answers' | 'votes';

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<TabType>('all');

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      const response = await api.get<Notification[]>('/notifications');
      setNotifications(response.data);
    } catch (error) {
      console.error('Failed to fetch notifications:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredNotifications = notifications.filter((n) => {
    if (activeTab === 'all') return true;
    if (activeTab === 'answers') return n.type === 'NEW_ANSWER' || n.type === 'NEW_REPLY';
    if (activeTab === 'votes') return n.type === 'ANSWER_VOTED';
    return true;
  });

  const markAsRead = async (id: number) => {
    try {
      await api.patch(`/notifications/${id}/read`);
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
      );
    } catch (error) {
      console.error('Failed to mark as read:', error);
    }
  };

  const markAllAsRead = async () => {
    try {
      await api.patch('/notifications/read-all');
      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
    } catch (error) {
      console.error('Failed to mark all as read:', error);
    }
  };

  const deleteNotification = async (id: number) => {
    try {
      await api.delete(`/notifications/${id}`);
      setNotifications((prev) => prev.filter((n) => n.id !== id));
    } catch (error) {
      console.error('Failed to delete notification:', error);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (minutes < 1) return 'Şimdi';
    if (minutes < 60) return `${minutes} dakika önce`;
    if (hours < 24) return `${hours} saat önce`;
    if (days < 7) return `${days} gün önce`;
    
    return date.toLocaleDateString('tr-TR');
  };

  const getIcon = (type: Notification['type']) => {
    switch (type) {
      case 'NEW_ANSWER':
        return <FiMessageSquare className="text-blue-500" />;
      case 'NEW_REPLY':
        return <FiMessageCircle className="text-green-500" />;
      case 'ANSWER_VOTED':
        return <FiThumbsUp className="text-rose-500" />;
      default:
        return <FiBell className="text-gray-500" />;
    }
  };

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const tabs: { key: TabType; label: string; icon: React.ReactNode }[] = [
    { key: 'all', label: 'Tümü', icon: <FiBell /> },
    { key: 'answers', label: 'Cevaplar', icon: <FiMessageSquare /> },
    { key: 'votes', label: 'Beğeniler', icon: <FiThumbsUp /> },
  ];

  return (
    <div className="min-h-screen relative" style={{ backgroundImage: 'url(/bg-pattern.jpg)', backgroundSize: 'cover', backgroundPosition: 'center', backgroundAttachment: 'fixed' }}>
      <div className="absolute inset-0 bg-white/70"></div>
      <div className="relative max-w-2xl mx-auto px-4 py-8">
      <div className="flex justify-center mb-4">
        <img 
          src="/kalpKedi.gif" 
          alt="" 
          className="w-36 h-auto"
        />
      </div>

      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
          <FiBell className="text-rose-500" />
          Bildirimler
          {unreadCount > 0 && (
            <span className="bg-rose-500 text-white text-sm px-2 py-1 rounded-full">
              {unreadCount}
            </span>
          )}
        </h1>
        {unreadCount > 0 && (
          <button
            onClick={markAllAsRead}
            className="flex items-center gap-2 text-rose-600 hover:text-rose-700 text-sm"
          >
            <FiCheckCircle />
            Tümünü Okundu İşaretle
          </button>
        )}
      </div>

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
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-20 bg-gray-200 animate-pulse rounded-lg"></div>
          ))}
        </div>
      ) : filteredNotifications.length === 0 ? (
        <div className="text-center py-12 bg-white border-2 border-rose-200 rounded-lg">
          <FiBell className="text-4xl text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500">
            {activeTab === 'answers' && 'Henüz cevap bildirimi yok.'}
            {activeTab === 'votes' && 'Henüz beğeni bildirimi yok.'}
            {activeTab === 'all' && 'Henüz bildiriminiz yok.'}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredNotifications.map((notification) => (
            <div
              key={notification.id}
              className={`bg-white border-2 rounded-lg p-4 transition-colors ${
                notification.isRead
                  ? 'border-gray-200'
                  : 'border-rose-300 bg-rose-50'
              }`}
            >
              <div className="flex items-start gap-3">
                <div className="mt-1 text-xl">
                  {getIcon(notification.type)}
                </div>
                <div className="flex-1">
                  <p className="text-gray-700">{notification.message}</p>
                  <p className="text-xs text-gray-400 mt-1">
                    {formatDate(notification.createdAt)}
                  </p>
                  {notification.questionId && (
                    <Link
                      to={`/questions/${notification.questionId}`}
                      className="text-sm text-rose-600 hover:text-rose-700 mt-2 inline-block"
                    >
                      Soruyu Görüntüle →
                    </Link>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  {!notification.isRead && (
                    <button
                      onClick={() => markAsRead(notification.id)}
                      className="p-2 text-gray-400 hover:text-green-500 transition-colors"
                      title="Okundu işaretle"
                    >
                      <FiCheck />
                    </button>
                  )}
                  <button
                    onClick={() => deleteNotification(notification.id)}
                    className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                    title="Sil"
                  >
                    <FiTrash2 />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      </div>
    </div>
  );
}
