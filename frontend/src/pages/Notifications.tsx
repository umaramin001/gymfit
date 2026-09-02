import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FiBell, FiCheck, FiTrash2, FiInfo, FiAlertTriangle, FiStar } from 'react-icons/fi';
import PageWrapper from '../components/PageWrapper';
import api from '../lib/api';
import { Notification } from '../types';
import { format } from 'date-fns';
import toast from 'react-hot-toast';

export default function Notifications() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/notifications').then(res => { setNotifications(res.data.data || []); setLoading(false); });
  }, []);

  const markRead = async (id: string) => {
    try {
      await api.put(`/notifications/${id}/read`);
      setNotifications(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n));
    } catch { toast.error('Failed'); }
  };

  const markAllRead = async () => {
    try {
      await api.put('/notifications/read-all');
      setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
      toast.success('All marked as read');
    } catch { toast.error('Failed'); }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'REMINDER': return <FiBell className="w-5 h-5 text-blue-400" />;
      case 'ACHIEVEMENT': return <FiStar className="w-5 h-5 text-yellow-400" />;
      case 'WARNING': return <FiAlertTriangle className="w-5 h-5 text-red-400" />;
      default: return <FiInfo className="w-5 h-5 text-white/40" />;
    }
  };

  const unreadCount = notifications.filter(n => !n.isRead).length;

  return (
    <PageWrapper title="Notifications">
      <div className="flex justify-between items-center mb-6">
        <p className="text-white/50">{unreadCount} unread notification{unreadCount !== 1 ? 's' : ''}</p>
        {unreadCount > 0 && (
          <button onClick={markAllRead} className="btn-ghost text-sm flex items-center gap-1 text-primary-400">
            <FiCheck className="w-4 h-4" /> Mark all read
          </button>
        )}
      </div>

      {loading ? (
        <div className="flex justify-center py-20"><div className="w-10 h-10 border-4 border-primary-500 border-t-transparent rounded-full animate-spin"/></div>
      ) : notifications.length === 0 ? (
        <div className="glass-card p-12 text-center">
          <FiBell className="w-16 h-16 text-white/20 mx-auto mb-4" />
          <p className="text-white/50">No notifications yet</p>
        </div>
      ) : (
        <div className="space-y-3">
          {notifications.map((n, i) => (
            <motion.div key={n.id} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.03 }}
              className={`glass-card p-5 flex items-start gap-4 ${!n.isRead ? 'border-primary-500/20 bg-primary-500/5' : ''}`}>
              <div className="mt-1">{getTypeIcon(n.type)}</div>
              <div className="flex-1">
                <h3 className="font-medium text-white">{n.title}</h3>
                <p className="text-sm text-white/60 mt-1">{n.message}</p>
                <p className="text-xs text-white/30 mt-2">{format(new Date(n.createdAt), 'MMM d, yyyy h:mm a')}</p>
              </div>
              {!n.isRead && (
                <button onClick={() => markRead(n.id)} className="text-primary-400 hover:text-primary-300 transition-colors shrink-0">
                  <FiCheck className="w-5 h-5" />
                </button>
              )}
            </motion.div>
          ))}
        </div>
      )}
    </PageWrapper>
  );
}
