import React from 'react';
import { formatDistanceToNow } from 'date-fns';

export default function NotificationCard({ notification, onMarkRead }) {
  const unread = !notification.read;
  return (
    <div
      onClick={() => onMarkRead && onMarkRead(notification._id)}
      className={`p-3 rounded shadow-sm border flex items-start gap-3 cursor-pointer ${unread ? 'bg-white' : 'bg-gray-50'} hover:bg-white`}
    >
      <div className={`h-3 w-3 rounded-full mt-2 ${unread ? 'bg-[var(--primary-blue)]' : 'bg-gray-300'}`}></div>
      <div className="flex-1">
        <div className={`text-sm ${unread ? 'text-gray-900 font-semibold' : 'text-gray-800'}`}>
          {notification.message}
        </div>
        <div className="text-xs text-gray-400 mt-1">{notification.type} • {formatDistanceToNow(new Date(notification.createdAt || Date.now()), { addSuffix: true })}</div>
      </div>
    </div>
  );
}
