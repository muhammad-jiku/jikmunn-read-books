import type { Notification, NotificationType } from '@/types/notification';
import { formatDistanceToNow } from 'date-fns';
import React from 'react';
import '../types';

const typeIcons: Record<NotificationType, JSX.Element> = {
  order: (
    <svg className='h-6 w-6' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
      <path
        strokeLinecap='round'
        strokeLinejoin='round'
        strokeWidth={2}
        d='M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z'
      />
    </svg>
  ),
  payment: (
    <svg className='h-6 w-6' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
      <path
        strokeLinecap='round'
        strokeLinejoin='round'
        strokeWidth={2}
        d='M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z'
      />
    </svg>
  ),
  promotion: (
    <svg className='h-6 w-6' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
      <path
        strokeLinecap='round'
        strokeLinejoin='round'
        strokeWidth={2}
        d='M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z'
      />
    </svg>
  ),
  system: (
    <svg className='h-6 w-6' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
      <path
        strokeLinecap='round'
        strokeLinejoin='round'
        strokeWidth={2}
        d='M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z'
      />
    </svg>
  ),
  support: (
    <svg className='h-6 w-6' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
      <path
        strokeLinecap='round'
        strokeLinejoin='round'
        strokeWidth={2}
        d='M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z'
      />
    </svg>
  ),
  book: (
    <svg className='h-6 w-6' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
      <path
        strokeLinecap='round'
        strokeLinejoin='round'
        strokeWidth={2}
        d='M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253'
      />
    </svg>
  ),
  review: (
    <svg className='h-6 w-6' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
      <path
        strokeLinecap='round'
        strokeLinejoin='round'
        strokeWidth={2}
        d='M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z'
      />
    </svg>
  ),
  auth: (
    <svg className='h-6 w-6' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
      <path
        strokeLinecap='round'
        strokeLinejoin='round'
        strokeWidth={2}
        d='M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z'
      />
    </svg>
  ),
};

const typeColors: Record<NotificationType, string> = {
  order: 'text-blue-600 bg-blue-100',
  payment: 'text-green-600 bg-green-100',
  promotion: 'text-purple-600 bg-purple-100',
  system: 'text-gray-600 bg-gray-100',
  support: 'text-yellow-600 bg-yellow-100',
  book: 'text-indigo-600 bg-indigo-100',
  review: 'text-orange-600 bg-orange-100',
  auth: 'text-red-600 bg-red-100',
};

interface Props {
  notification: Notification;
  onRead: (id: string) => void;
}

export const NotificationItem: React.FC<Props> = ({ notification, onRead }) => {
  return (
    <div
      className={`p-4 ${
        notification.isRead ? 'bg-white' : 'bg-blue-50'
      } hover:bg-gray-50 transition-colors duration-200`}
    >
      <div className='flex items-start space-x-4'>
        <div className={`rounded-full p-2 ${typeColors[notification.type]}`}>
          {typeIcons[notification.type]}
        </div>
        <div className='flex-1 min-w-0'>
          <div className='flex items-center justify-between'>
            <p className='text-sm font-medium text-gray-900'>{notification.title}</p>
            <span className='text-xs text-gray-500'>
              {formatDistanceToNow(new Date(notification.createdAt), {
                addSuffix: true,
              })}
            </span>
          </div>
          <p className='mt-1 text-sm text-gray-500'>{notification.message}</p>
          {!notification.isRead && (
            <button
              onClick={() => onRead(notification._id)}
              className='mt-2 text-xs text-primary-600 hover:text-primary-800'
            >
              Mark as read
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
