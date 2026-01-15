import React from 'react';
import { Bell, ArrowLeft, Check, Heart, MessageSquare, UserPlus, User, Trash2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { formatDistanceToNow } from 'date-fns';
import { useNotifications } from '../hooks/useNotifications';
import { useNavigate } from 'react-router-dom';
import type { Notification } from '../types';

function Notifications() {
  const navigate = useNavigate();
  const {
    notifications,
    unreadCount,
    markAsRead,
    markAllAsRead
  } = useNotifications();

  const handleNotificationClick = (notification: Notification) => {
    markAsRead(notification.id);

    if (notification.post_id) {
      navigate(`/community/post/${notification.post_id}`);
    } else if (notification.type === 'friend_request') {
      navigate('/friends');
    } else if (notification.related_user_id) {
      navigate(`/user/${notification.related_user_id}`);
    }
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'like':
        return <Heart className="w-5 h-5 text-red-500" />;
      case 'comment':
        return <MessageSquare className="w-5 h-5 text-blue-500" />;
      case 'friend_request':
        return <UserPlus className="w-5 h-5 text-green-500" />;
      case 'mention':
        return <User className="w-5 h-5 text-purple-500" />;
      default:
        return <Bell className="w-5 h-5 text-brand-gold" />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900">
      <div className="max-w-4xl mx-auto px-4 py-6">
        <div className="glass-panel p-6 mb-6">
          <div className="flex items-center gap-4 mb-4">
            <button
              onClick={() => navigate(-1)}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors"
              aria-label="Go back"
            >
              <ArrowLeft className="w-6 h-6" />
            </button>
            <div className="flex items-center gap-3 flex-1">
              <Bell className="w-8 h-8 text-brand-gold" />
              <div>
                <h1 className="text-3xl font-bold">Notifications</h1>
                {unreadCount > 0 && (
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {unreadCount} unread notification{unreadCount > 1 ? 's' : ''}
                  </p>
                )}
              </div>
            </div>
            {unreadCount > 0 && (
              <button
                onClick={() => markAllAsRead()}
                className="flex items-center gap-2 px-4 py-2 bg-brand-gold hover:bg-amber-500 text-black font-semibold rounded-lg transition-colors"
              >
                <Check className="w-4 h-4" />
                <span className="hidden sm:inline">Mark all read</span>
              </button>
            )}
          </div>
        </div>

        <div className="glass-panel">
          {notifications.length === 0 ? (
            <div className="p-12 text-center">
              <Bell className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2 text-gray-900 dark:text-white">
                No notifications yet
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                When you get likes, comments, or friend requests, they'll show up here
              </p>
            </div>
          ) : (
            <div className="divide-y divide-gray-200 dark:divide-gray-700">
              {notifications.map((notification, index) => (
                <motion.div
                  key={notification.id}
                  className={`p-4 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors cursor-pointer ${
                    !notification.read ? 'bg-blue-50 dark:bg-blue-900/20' : ''
                  }`}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  onClick={() => handleNotificationClick(notification)}
                >
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center overflow-hidden flex-shrink-0">
                      {notification.related_user?.avatar_url ? (
                        <img
                          src={notification.related_user.avatar_url}
                          alt={notification.related_user.username}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <User className="w-6 h-6 text-gray-400" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start gap-2 mb-1">
                        {getIcon(notification.type)}
                        <p className="text-sm text-gray-900 dark:text-white flex-1">
                          {notification.content}
                        </p>
                        {!notification.read && (
                          <div className="w-2 h-2 rounded-full bg-blue-500 mt-1 flex-shrink-0"></div>
                        )}
                      </div>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {formatDistanceToNow(new Date(notification.created_at), { addSuffix: true })}
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Notifications;
