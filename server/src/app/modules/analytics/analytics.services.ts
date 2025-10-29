/* eslint-disable @typescript-eslint/no-explicit-any */
import { Author } from '../authors/authors.model';
import { Book } from '../books/books.model';
import { Order } from '../orders/orders.model';
import { User } from '../users/users.model';
import {
  IAnalyticsFilters,
  IPlatformAnalytics,
  ISalesReport,
  IUserAnalytics,
} from './analytics.interfaces';

const generateSalesReport = async (
  filters: IAnalyticsFilters,
): Promise<ISalesReport> => {
  // eslint-disable-next-line no-unused-vars
  const { startDate, endDate, category, author } = filters;

  // Build match conditions for the aggregation pipeline
  const matchConditions: any = {
    paymentStatus: 'completed',
    createdAt: {
      $gte: new Date(startDate),
      $lte: new Date(endDate),
    },
  };

  const orders = await Order.find(matchConditions).populate('items.book');

  let totalSales = 0;
  const totalOrders = orders.length;
  const salesByDateMap: { [key: string]: number } = {};
  const productSales: { [key: string]: { product: any; sales: number } } = {};
  const categorySales: { [key: string]: number } = {};

  orders.forEach(order => {
    totalSales += order.totalAmount;

    const date = order.createdAt.toISOString().split('T')[0];
    salesByDateMap[date] = (salesByDateMap[date] || 0) + order.totalAmount;

    order.items.forEach(item => {
      const book: any = item.book;
      if (!productSales[book._id]) {
        productSales[book._id] = { product: book, sales: 0 };
      }
      productSales[book._id].sales += item.quantity * item.price;

      if (book.category) {
        categorySales[book.category] =
          (categorySales[book.category] || 0) + item.quantity * item.price;
      }
    });
  });

  const salesByDate = Object.entries(salesByDateMap)
    .map(([date, sales]) => ({ date, sales }))
    .sort((a, b) => a.date.localeCompare(b.date));

  const topProducts = Object.values(productSales)
    .sort((a, b) => b.sales - a.sales)
    .slice(0, 10);

  const salesByCategory = Object.entries(categorySales)
    .map(([category, sales]) => ({ category, sales }))
    .sort((a, b) => b.sales - a.sales);

  return {
    totalSales,
    totalOrders,
    averageOrderValue: totalOrders > 0 ? totalSales / totalOrders : 0,
    salesByDate,
    topProducts,
    salesByCategory,
  };
};

const generateUserAnalytics = async (
  filters: IAnalyticsFilters,
): Promise<IUserAnalytics> => {
  const { startDate, endDate } = filters;

  const totalUsers = await User.countDocuments();
  const newUsers = await User.countDocuments({
    createdAt: {
      $gte: new Date(startDate),
      $lte: new Date(endDate),
    },
  });

  // Active users: users who have placed an order in the given period
  const activeUsers = await Order.distinct('user', {
    paymentStatus: 'completed',
    createdAt: {
      $gte: new Date(startDate),
      $lte: new Date(endDate),
    },
  });

  // User growth over time (simplified: by registration date)
  const userGrowth = await User.aggregate([
    {
      $match: {
        createdAt: {
          $gte: new Date(startDate),
          $lte: new Date(endDate),
        },
      },
    },
    {
      $group: {
        _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
        users: { $sum: 1 },
      },
    },
    { $sort: { _id: 1 } },
  ]);

  const userGrowthFormatted = userGrowth.map(entry => ({
    date: entry._id,
    users: entry.users,
  }));

  return {
    totalUsers,
    newUsers,
    activeUsers: activeUsers.length,
    userGrowth: userGrowthFormatted,
  };
};

const generatePlatformAnalytics = async (
  filters: IAnalyticsFilters,
): Promise<IPlatformAnalytics> => {
  const { startDate, endDate } = filters;

  const [
    totalBooks,
    totalAuthors,
    totalCustomers,
    revenueStats,
    popularCategories,
  ] = await Promise.all([
    Book.countDocuments(),
    Author.countDocuments(),
    User.countDocuments({ role: 'customer' }),

    // Revenue stats
    Order.aggregate([
      {
        $match: {
          paymentStatus: 'completed',
          createdAt: {
            $gte: new Date(startDate),
            $lte: new Date(endDate),
          },
        },
      },
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: '$totalAmount' },
          averageOrderValue: { $avg: '$totalAmount' },
          orderCount: { $sum: 1 },
        },
      },
    ]),

    // Popular categories
    Book.aggregate([
      {
        $group: {
          _id: '$genre',
          bookCount: { $sum: 1 },
        },
      },
      { $sort: { bookCount: -1 } },
      { $limit: 10 },
    ]),
  ]);

  const revenue = revenueStats[0] || {
    totalRevenue: 0,
    averageOrderValue: 0,
    orderCount: 0,
  };

  return {
    totalBooks,
    totalAuthors,
    totalCustomers,
    totalRevenue: revenue.totalRevenue,
    averageOrderValue: revenue.averageOrderValue,
    totalOrders: revenue.orderCount,
    popularCategories: popularCategories.map(cat => ({
      category: cat._id,
      bookCount: cat.bookCount,
    })),
  };
};

const getAuthorPerformance = async (
  authorId: string,
  filters: IAnalyticsFilters,
) => {
  const { startDate, endDate } = filters;

  const author = await Author.findOne({ id: authorId });
  if (!author) {
    throw new Error('Author not found');
  }

  const authorBooks = await Book.find({ author: author._id });
  const bookIds = authorBooks.map(book => book._id);

  const salesData = await Order.aggregate([
    {
      $match: {
        paymentStatus: 'completed',
        'items.book': { $in: bookIds },
        createdAt: {
          $gte: new Date(startDate),
          $lte: new Date(endDate),
        },
      },
    },
    { $unwind: '$items' },
    {
      $match: {
        'items.book': { $in: bookIds },
      },
    },
    {
      $group: {
        _id: '$items.book',
        totalSales: { $sum: '$items.quantity' },
        totalRevenue: {
          $sum: { $multiply: ['$items.quantity', '$items.price'] },
        },
      },
    },
  ]);

  const booksWithSales = authorBooks.map(book => {
    const saleData = salesData.find(
      sale => sale._id.toString() === book._id.toString(),
    );
    return {
      book: {
        title: book.title,
        price: book.price,
      },
      totalSales: saleData?.totalSales || 0,
      totalRevenue: saleData?.totalRevenue || 0,
    };
  });

  const totalSales = booksWithSales.reduce(
    (sum, book) => sum + book.totalSales,
    0,
  );
  const totalRevenue = booksWithSales.reduce(
    (sum, book) => sum + book.totalRevenue,
    0,
  );

  return {
    author: {
      name: author.name,
      email: author.email,
    },
    totalBooks: authorBooks.length,
    totalSales,
    totalRevenue,
    books: booksWithSales.sort((a, b) => b.totalRevenue - a.totalRevenue),
  };
};

export const AnalyticsServices = {
  generateSalesReport,
  generateUserAnalytics,
  generatePlatformAnalytics,
  getAuthorPerformance,
};
