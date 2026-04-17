import React from 'react';
import { formatDistanceToNow } from 'date-fns';

export default function NotificationCard({ notification }) {
  return (
    <div className="p-3 bg-white rounded shadow-sm border flex items-start gap-3">
      <div className="flex-1">
        <div className="text-sm text-gray-800">{notification.message}</div>
        <div className="text-xs text-gray-400 mt-1">{notification.type} • {formatDistanceToNow(new Date(notification.createdAt || Date.now()), { addSuffix: true })}</div>
      </div>
    </div>
  );
}
