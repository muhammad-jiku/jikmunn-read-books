/* eslint-disable @typescript-eslint/no-explicit-any */
export type ISalesReport = {
  totalSales: number;
  totalOrders: number;
  averageOrderValue: number;
  salesByDate: { date: string; sales: number }[];
  topProducts: { product: any; sales: number }[];
  salesByCategory: { category: string; sales: number }[];
};

export type IUserAnalytics = {
  totalUsers: number;
  newUsers: number;
  activeUsers: number;
  userGrowth: { date: string; users: number }[];
};

export type IPlatformAnalytics = {
  totalBooks: number;
  totalAuthors: number;
  totalCustomers: number;
  totalRevenue: number;
  averageOrderValue: number;
  totalOrders: number;
  popularCategories: { category: string; bookCount: number }[];
};

export type IAnalyticsFilters = {
  startDate: string;
  endDate: string;
  category?: string;
  author?: string;
};
