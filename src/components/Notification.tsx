import React from 'react';
import { Bell, X, Check, Heart, MessageSquare, UserPlus, User } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { formatDistanceToNow } from 'date-fns';

export interface NotificationItem {
  id: string;
  type: 'like' | 'comment' | 'friend_request' | 'mention' | 'system';
  content: string;
  created_at: string;
  read: boolean;
  user?: {
    id: string;
    username: string;
    avatar_url?: string;
  };
  post_id?: string;
}

interface NotificationProps {
  notification: NotificationItem;
  onMarkAsRead: (id: string) => void;
  onClick?: () => void;
}

function NotificationItem({ notification, onMarkAsRead, onClick }: NotificationProps) {
  const getIcon = () => {
    switch (notification.type) {
      case 'like':
        return <Heart className="w-4 h-4 text-red-500" />;
      case 'comment':
        return <MessageSquare className="w-4 h-4 text-blue-500" />;
      case 'friend_request':
        return <UserPlus className="w-4 h-4 text-green-500" />;
      case 'mention':
        return <User className="w-4 h-4 text-purple-500" />;
      default:
        return <Bell className="w-4 h-4 text-brand-gold" />;
    }
  };

  return (
    <motion.div 
      className={`p-3 border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors cursor-pointer ${
        !notification.read ? 'bg-blue-50 dark:bg-blue-900/20' : ''
      }`}
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 10 }}
      onClick={() => {
        onMarkAsRead(notification.id);
        onClick?.();
      }}
    >
      <div className="flex items-start gap-3">
        <div className="w-10 h-10 rounded-full bg-brand-gold/10 flex items-center justify-center overflow-hidden flex-shrink-0">
          {notification.user?.avatar_url ? (
            <img
              src={notification.user.avatar_url}
              alt={notification.user.username}
              className="w-full h-full object-cover"
            />
          ) : (
            <User className="w-5 h-5 text-brand-gold" />
          )}
        </div>
        <div className="flex-1">
          <p className="text-sm">{notification.content}</p>
          <p className="text-xs text-gray-500 mt-1">
            {formatDistanceToNow(new Date(notification.created_at), { addSuffix: true })}
          </p>
        </div>
        {!notification.read && (
          <div className="w-2 h-2 rounded-full bg-blue-500 mt-2"></div>
        )}
      </div>
    </motion.div>
  );
}

interface NotificationListProps {
  notifications: NotificationItem[];
  onMarkAsRead: (id: string) => void;
  onMarkAllAsRead: () => void;
  onNotificationClick?: (notification: NotificationItem) => void;
}

export function NotificationList({ 
  notifications, 
  onMarkAsRead, 
  onMarkAllAsRead,
  onNotificationClick
}: NotificationListProps) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
      <div className="p-3 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
        <h3 className="font-semibold">Notifications</h3>
        <button 
          onClick={onMarkAllAsRead}
          className="text-sm text-brand-gold hover:underline"
        >
          Mark all as read
        </button>
      </div>
      
      <div className="max-h-96 overflow-y-auto">
        <AnimatePresence>
          {notifications.length === 0 ? (
            <div className="p-4 text-center text-gray-500">
              No notifications yet
            </div>
          ) : (
            notifications.map(notification => (
              <NotificationItem 
                key={notification.id}
                notification={notification}
                onMarkAsRead={onMarkAsRead}
                onClick={() => onNotificationClick?.(notification)}
              />
            ))
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

interface NotificationBellProps {
  hasNewNotifications: boolean;
  onClick: () => void;
  className?: string;
}

export function NotificationBell({ hasNewNotifications, onClick, className = '' }: NotificationBellProps) {
  return (
    <button 
      onClick={onClick}
      className={`relative p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 ${className}`}
    >
      <Bell className="w-5 h-5" />
      {hasNewNotifications && (
        <motion.span 
          className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 500, damping: 15 }}
        />
      )}
    </button>
  );
}

export default {
  NotificationItem,
  NotificationList,
  NotificationBell
};