import type { Notification, NotificationType } from '@/types/notification';
import { notificationsApi } from '@services/notificationsApi';
import React, { useState } from 'react';
import '../types';
import { NotificationItem } from './NotificationItem';

const { useGetNotificationsQuery, useMarkAllAsReadMutation, useMarkAsReadMutation } =
  notificationsApi;

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export const NotificationCenter: React.FC<Props> = ({ isOpen, onClose }) => {
  const [filter, setFilter] = useState<NotificationType | 'all'>('all');
  const { data, isLoading } = useGetNotificationsQuery({
    type: filter === 'all' ? undefined : filter,
  });
  const [markAsRead] = useMarkAsReadMutation();
  const [markAllAsRead] = useMarkAllAsReadMutation();

  if (!isOpen) return null;

  const handleMarkAsRead = async (id: string) => {
    try {
      await markAsRead(id).unwrap();
    } catch (error) {
      console.error('Failed to mark notification as read:', error);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await markAllAsRead().unwrap();
    } catch (error) {
      console.error('Failed to mark all notifications as read:', error);
    }
  };

  return (
    <div className='fixed inset-0 z-50 overflow-hidden'>
      <div
        className='absolute inset-0 bg-gray-500 bg-opacity-75 transition-opacity'
        onClick={onClose}
      />

      <div className='fixed inset-y-0 right-0 pl-10 max-w-full flex'>
        <div className='w-screen max-w-md'>
          <div className='h-full flex flex-col bg-white shadow-xl'>
            <div className='p-6 border-b border-gray-200'>
              <div className='flex items-start justify-between'>
                <h2 className='text-lg font-medium text-gray-900'>Notifications</h2>
                <button onClick={onClose} className='ml-3 h-7 flex items-center'>
                  <span className='sr-only'>Close panel</span>
                  <svg
                    className='h-6 w-6 text-gray-400 hover:text-gray-500'
                    fill='none'
                    viewBox='0 0 24 24'
                    stroke='currentColor'
                  >
                    <path
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      strokeWidth='2'
                      d='M6 18L18 6M6 6l12 12'
                    />
                  </svg>
                </button>
              </div>

              <div className='mt-4 flex items-center justify-between'>
                <select
                  value={filter}
                  onChange={(e) => setFilter(e.target.value as NotificationType | 'all')}
                  className='block w-40 pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm rounded-md'
                  title='Filter notifications'
                  aria-label='Filter notifications by type'
                >
                  <option value='all'>All</option>
                  <option value='order'>Orders</option>
                  <option value='payment'>Payments</option>
                  <option value='promotion'>Promotions</option>
                  <option value='system'>System</option>
                  <option value='support'>Support</option>
                </select>

                <button
                  onClick={handleMarkAllAsRead}
                  className='text-sm text-primary-600 hover:text-primary-800'
                >
                  Mark all as read
                </button>
              </div>
            </div>

            <div className='flex-1 overflow-y-auto'>
              {isLoading ? (
                <div className='animate-pulse p-4 space-y-4'>
                  {[...Array(5)].map((_, i) => (
                    <div key={i} className='h-20 bg-gray-100 rounded'></div>
                  ))}
                </div>
              ) : data?.notifications.length === 0 ? (
                <div className='p-4 text-center text-gray-500'>No notifications to display</div>
              ) : (
                <div className='divide-y divide-gray-200'>
                  {data?.notifications.map((notification: Notification) => (
                    <NotificationItem
                      key={notification._id}
                      notification={notification}
                      onRead={handleMarkAsRead}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
