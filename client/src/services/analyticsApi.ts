import { api } from '@utils/api';
import type {
  AnalyticsFilters,
  AuthorPerformance,
  PlatformAnalytics,
  SalesReport,
  UserAnalytics,
} from '../types/analytics';

export const analyticsApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getSalesReport: builder.query<SalesReport, AnalyticsFilters>({
      query: (filters) => ({
        url: 'analytics/sales',
        params: filters,
      }),
      providesTags: ['Analytics'],
    }),

    getUserAnalytics: builder.query<UserAnalytics, void>({
      query: () => 'analytics/users',
      providesTags: ['Analytics'],
    }),

    getPlatformAnalytics: builder.query<PlatformAnalytics, void>({
      query: () => 'analytics/platform',
      providesTags: ['Analytics'],
    }),

    getAuthorPerformance: builder.query<AuthorPerformance, string>({
      query: (authorId) => `analytics/authors/${authorId}`,
      providesTags: ['Analytics'],
    }),
  }),
});

export const {
  useGetSalesReportQuery,
  useGetUserAnalyticsQuery,
  useGetPlatformAnalyticsQuery,
  useGetAuthorPerformanceQuery,
} = analyticsApi;
