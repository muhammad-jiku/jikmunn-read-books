import React, { useState } from 'react';
import { CategoryDistribution } from '../components/analytics/CategoryDistribution';
import { SalesChart } from '../components/analytics/SalesChart';
import { Stats } from '../components/analytics/Stats';
import { analyticsApi } from '../services/analyticsApi';

const { useGetPlatformAnalyticsQuery, useGetSalesReportQuery } = analyticsApi;

export const AnalyticsDashboard: React.FC = () => {
  const [dateRange, setDateRange] = useState({
    startDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    endDate: new Date().toISOString().split('T')[0],
  });

  const { data: salesReport, isLoading: isLoadingSales } = useGetSalesReportQuery(dateRange);
  const { data: platformAnalytics, isLoading: isLoadingPlatform } = useGetPlatformAnalyticsQuery();

  if (isLoadingSales || isLoadingPlatform) {
    return (
      <div className='animate-pulse space-y-4 p-6'>
        <div className='h-10 bg-gray-200 rounded w-1/4'></div>
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4'>
          {[...Array(4)].map((_, i) => (
            <div key={i} className='h-32 bg-gray-200 rounded'></div>
          ))}
        </div>
        <div className='h-72 bg-gray-200 rounded'></div>
      </div>
    );
  }

  const platformStats = platformAnalytics
    ? [
        {
          label: 'Total Revenue',
          value: `$${platformAnalytics.totalRevenue.toLocaleString()}`,
        },
        {
          label: 'Total Orders',
          value: platformAnalytics.totalOrders.toLocaleString(),
        },
        {
          label: 'Average Order Value',
          value: `$${platformAnalytics.averageOrderValue.toLocaleString()}`,
        },
        {
          label: 'Total Customers',
          value: platformAnalytics.totalCustomers.toLocaleString(),
        },
      ]
    : [];

  return (
    <div className='p-6 space-y-6'>
      <div className='flex justify-between items-center'>
        <h1 className='text-2xl font-semibold text-gray-900'>Analytics Dashboard</h1>
        <div className='flex space-x-4'>
          <input
            type='date'
            value={dateRange.startDate}
            onChange={(e) => setDateRange((prev) => ({ ...prev, startDate: e.target.value }))}
            className='rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500'
            aria-label='Start date'
            title='Select start date'
          />
          <input
            type='date'
            value={dateRange.endDate}
            onChange={(e) => setDateRange((prev) => ({ ...prev, endDate: e.target.value }))}
            className='rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500'
            aria-label='End date'
            title='Select end date'
          />
        </div>
      </div>

      {platformStats.length > 0 && <Stats stats={platformStats} />}

      {salesReport && (
        <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
          <div className='bg-white p-6 rounded-lg shadow'>
            <h2 className='text-lg font-semibold mb-4'>Sales Over Time</h2>
            <SalesChart data={salesReport.salesByDate} />
          </div>

          <div className='bg-white p-6 rounded-lg shadow'>
            <h2 className='text-lg font-semibold mb-4'>Sales by Category</h2>
            <CategoryDistribution data={salesReport.salesByCategory} />
          </div>

          <div className='bg-white p-6 rounded-lg shadow lg:col-span-2'>
            <h2 className='text-lg font-semibold mb-4'>Top Selling Books</h2>
            <div className='overflow-x-auto'>
              <table className='min-w-full divide-y divide-gray-200'>
                <thead>
                  <tr>
                    <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                      Book
                    </th>
                    <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                      Sales
                    </th>
                  </tr>
                </thead>
                <tbody className='bg-white divide-y divide-gray-200'>
                  {salesReport.topProducts.map(
                    (
                      product: {
                        product: {
                          id: string;
                          title: string;
                          price: number;
                          category: string;
                          author: string;
                          coverImage?: string;
                        };
                        sales: number;
                      },
                      index: number,
                    ) => (
                      <tr key={index}>
                        <td className='px-6 py-4 whitespace-nowrap'>
                          <div className='flex items-center'>
                            <div className='shrink-0 h-10 w-10'>
                              <img
                                className='h-10 w-10 rounded-full'
                                src={product.product.coverImage}
                                alt=''
                              />
                            </div>
                            <div className='ml-4'>
                              <div className='text-sm font-medium text-gray-900'>
                                {product.product.title}
                              </div>
                              <div className='text-sm text-gray-500'>{product.product.author}</div>
                            </div>
                          </div>
                        </td>
                        <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-500'>
                          ${product.sales.toLocaleString()}
                        </td>
                      </tr>
                    ),
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
