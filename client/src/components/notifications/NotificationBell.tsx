import { useGetUnreadCountQuery } from '@services/notificationsApi';
import React from 'react';

export const NotificationBell: React.FC<{
  onClick: () => void;
}> = ({ onClick }) => {
  const { data: unreadCount = 0 } = useGetUnreadCountQuery();

  return (
    <button
      onClick={onClick}
      className='relative p-2 text-gray-600 hover:text-gray-800 focus:outline-none focus:ring-2 focus:ring-primary-500 rounded-full'
    >
      <svg
        className='h-6 w-6'
        fill='none'
        strokeLinecap='round'
        strokeLinejoin='round'
        strokeWidth='2'
        viewBox='0 0 24 24'
        stroke='currentColor'
      >
        <path d='M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9' />
      </svg>
      {unreadCount > 0 && (
        <span className='absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform translate-x-1/2 -translate-y-1/2 bg-red-600 rounded-full'>
          {unreadCount > 99 ? '99+' : unreadCount}
        </span>
      )}
    </button>
  );
};
