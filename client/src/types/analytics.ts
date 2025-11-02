export interface SalesReport {
  totalSales: number;
  totalOrders: number;
  averageOrderValue: number;
  salesByDate: Array<{ date: string; sales: number }>;
  topProducts: Array<{
    product: {
      id: string;
      title: string;
      price: number;
      category: string;
      author: string;
    };
    sales: number;
  }>;
  salesByCategory: Array<{ category: string; sales: number }>;
}

export interface UserAnalytics {
  totalUsers: number;
  newUsers: number;
  activeUsers: number;
  userGrowth: Array<{ date: string; users: number }>;
}

export interface PlatformAnalytics {
  totalBooks: number;
  totalAuthors: number;
  totalCustomers: number;
  totalRevenue: number;
  averageOrderValue: number;
  totalOrders: number;
  popularCategories: Array<{ category: string; bookCount: number }>;
}

export interface AnalyticsFilters {
  startDate: string;
  endDate: string;
  category?: string;
  author?: string;
}

export interface AuthorPerformance {
  totalSales: number;
  totalBooks: number;
  averageRating: number;
  salesByBook: Array<{ book: string; sales: number }>;
  revenueByMonth: Array<{ month: string; revenue: number }>;
}
