import { api } from '@utils/api';
import type {
  Notification,
  NotificationFilters,
  NotificationPreferences,
} from '../interfaces/notification';

type NotificationsResponse = {
  notifications: Notification[];
  total: number;
};

const notificationsApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getNotifications: builder.query<NotificationsResponse, NotificationFilters>({
      query: (filters) => ({
        url: 'notifications',
        params: filters,
      }),
      providesTags: ['Notifications'],
    }),

    getUnreadCount: builder.query<number, void>({
      query: () => 'notifications/unread/count',
      providesTags: ['Notifications'],
    }),

    getNotificationPreferences: builder.query<NotificationPreferences, void>({
      query: () => 'notifications/preferences',
      providesTags: ['Notifications'],
    }),

    updateNotificationPreferences: builder.mutation<void, Partial<NotificationPreferences>>({
      query: (preferences) => ({
        url: 'notifications/preferences',
        method: 'PATCH',
        body: preferences,
      }),
      invalidatesTags: ['Notifications'],
    }),

    markAsRead: builder.mutation<void, string>({
      query: (id) => ({
        url: `notifications/${id}/read`,
        method: 'PATCH',
      }),
      invalidatesTags: ['Notifications'],
    }),

    markAllAsRead: builder.mutation<void, void>({
      query: () => ({
        url: 'notifications/read-all',
        method: 'PATCH',
      }),
      invalidatesTags: ['Notifications'],
    }),

    subscribeToWebPush: builder.mutation<void, PushSubscription>({
      query: (subscription) => ({
        url: 'notifications/push/subscribe',
        method: 'POST',
        body: { subscription },
      }),
    }),
  }),
});

export const {
  useGetNotificationsQuery,
  useGetUnreadCountQuery,
  useGetNotificationPreferencesQuery,
  useUpdateNotificationPreferencesMutation,
  useMarkAsReadMutation,
  useMarkAllAsReadMutation,
  useSubscribeToWebPushMutation,
} = notificationsApi;

export { notificationsApi };
