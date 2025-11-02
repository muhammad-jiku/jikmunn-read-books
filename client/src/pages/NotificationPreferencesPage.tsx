import React from 'react';
import {
  useGetNotificationPreferencesQuery,
  useUpdateNotificationPreferencesMutation,
} from '../services/notificationsApi';
import type { NotificationPreferences } from '../types/notification';

const notificationTypes = [
  { id: 'orders', label: 'Order Updates' },
  { id: 'payments', label: 'Payment Updates' },
  { id: 'promotions', label: 'Promotions & Deals' },
  { id: 'system', label: 'System Updates' },
  { id: 'support', label: 'Support Messages' },
];

export const NotificationPreferencesPage: React.FC = () => {
  const { data: preferences, isLoading } = useGetNotificationPreferencesQuery();
  const [updatePreferences] = useUpdateNotificationPreferencesMutation();

  const handleToggle = async (
    channel: keyof NotificationPreferences,
    type: string,
    value: boolean,
  ) => {
    if (!preferences) return;

    try {
      await updatePreferences({
        [channel]: {
          ...preferences[channel],
          [type]: value,
        },
      }).unwrap();
    } catch (error) {
      console.error('Failed to update preferences:', error);
    }
  };

  if (isLoading) {
    return (
      <div className='animate-pulse p-6 space-y-6'>
        <div className='h-8 bg-gray-200 rounded w-1/4'></div>
        {[...Array(3)].map((_, i) => (
          <div key={i} className='space-y-4'>
            <div className='h-6 bg-gray-200 rounded w-1/6'></div>
            <div className='h-40 bg-gray-200 rounded'></div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className='max-w-4xl mx-auto p-6'>
      <h1 className='text-2xl font-semibold text-gray-900 mb-8'>Notification Preferences</h1>

      <div className='space-y-8'>
        {/* Email Preferences */}
        <section>
          <h2 className='text-lg font-medium text-gray-900 mb-4'>Email Notifications</h2>
          <div className='bg-white shadow rounded-lg divide-y divide-gray-200'>
            {notificationTypes.map(({ id, label }) => (
              <div key={id} className='p-4 flex items-center justify-between'>
                <div>
                  <p className='text-sm font-medium text-gray-900'>{label}</p>
                  <p className='text-sm text-gray-500'>
                    Receive email notifications for {label.toLowerCase()}
                  </p>
                </div>
                <button
                  className={`${
                    preferences?.email[id as keyof typeof preferences.email]
                      ? 'bg-primary-600'
                      : 'bg-gray-200'
                  } relative inline-flex shrink-0 h-6 w-11 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500`}
                  onClick={() =>
                    handleToggle(
                      'email',
                      id,
                      !preferences?.email[id as keyof typeof preferences.email],
                    )
                  }
                >
                  <span className='sr-only'>Toggle {label}</span>
                  <span
                    className={`${
                      preferences?.email[id as keyof typeof preferences.email]
                        ? 'translate-x-5'
                        : 'translate-x-0'
                    } pointer-events-none relative inline-block h-5 w-5 rounded-full bg-white shadow transform ring-0 transition ease-in-out duration-200`}
                  />
                </button>
              </div>
            ))}
          </div>
        </section>

        {/* Push Notification Preferences */}
        <section>
          <h2 className='text-lg font-medium text-gray-900 mb-4'>Push Notifications</h2>
          <div className='bg-white shadow rounded-lg divide-y divide-gray-200'>
            {notificationTypes.map(({ id, label }) => (
              <div key={id} className='p-4 flex items-center justify-between'>
                <div>
                  <p className='text-sm font-medium text-gray-900'>{label}</p>
                  <p className='text-sm text-gray-500'>
                    Receive push notifications for {label.toLowerCase()}
                  </p>
                </div>
                <button
                  className={`${
                    preferences?.push[id as keyof typeof preferences.push]
                      ? 'bg-primary-600'
                      : 'bg-gray-200'
                  } relative inline-flex shrink-0 h-6 w-11 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500`}
                  onClick={() =>
                    handleToggle(
                      'push',
                      id,
                      !preferences?.push[id as keyof typeof preferences.push],
                    )
                  }
                >
                  <span className='sr-only'>Toggle {label}</span>
                  <span
                    className={`${
                      preferences?.push[id as keyof typeof preferences.push]
                        ? 'translate-x-5'
                        : 'translate-x-0'
                    } pointer-events-none relative inline-block h-5 w-5 rounded-full bg-white shadow transform ring-0 transition ease-in-out duration-200`}
                  />
                </button>
              </div>
            ))}
          </div>
        </section>

        {/* SMS Preferences */}
        <section>
          <h2 className='text-lg font-medium text-gray-900 mb-4'>SMS Notifications</h2>
          <div className='bg-white shadow rounded-lg divide-y divide-gray-200'>
            {notificationTypes.map(({ id, label }) => (
              <div key={id} className='p-4 flex items-center justify-between'>
                <div>
                  <p className='text-sm font-medium text-gray-900'>{label}</p>
                  <p className='text-sm text-gray-500'>
                    Receive SMS notifications for {label.toLowerCase()}
                  </p>
                </div>
                <button
                  className={`${
                    preferences?.sms[id as keyof typeof preferences.sms]
                      ? 'bg-primary-600'
                      : 'bg-gray-200'
                  } relative inline-flex shrink-0 h-6 w-11 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500`}
                  onClick={() =>
                    handleToggle('sms', id, !preferences?.sms[id as keyof typeof preferences.sms])
                  }
                >
                  <span className='sr-only'>Toggle {label}</span>
                  <span
                    className={`${
                      preferences?.sms[id as keyof typeof preferences.sms]
                        ? 'translate-x-5'
                        : 'translate-x-0'
                    } pointer-events-none relative inline-block h-5 w-5 rounded-full bg-white shadow transform ring-0 transition ease-in-out duration-200`}
                  />
                </button>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};
