import React from 'react';
import { useParams } from 'react-router-dom';
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { Stats } from '../components/analytics/Stats';
import { useGetAuthorPerformanceQuery } from '../services/analyticsApi';

export const AuthorAnalytics: React.FC = () => {
  const { authorId } = useParams<{ authorId: string }>();
  const { data, isLoading } = useGetAuthorPerformanceQuery(authorId!);

  if (isLoading) {
    return (
      <div className='animate-pulse space-y-4 p-6'>
        <div className='h-10 bg-gray-200 rounded w-1/4'></div>
        <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
          {[...Array(3)].map((_, i) => (
            <div key={i} className='h-32 bg-gray-200 rounded'></div>
          ))}
        </div>
        <div className='h-72 bg-gray-200 rounded'></div>
      </div>
    );
  }

  if (!data) return null;

  const stats = [
    {
      label: 'Total Sales',
      value: `$${data.totalSales.toLocaleString()}`,
    },
    {
      label: 'Total Books',
      value: data.totalBooks,
    },
    {
      label: 'Average Rating',
      value: data.averageRating.toFixed(1),
    },
  ];

  return (
    <div className='p-6 space-y-6'>
      <h1 className='text-2xl font-semibold text-gray-900'>Author Performance</h1>

      <Stats stats={stats} />

      <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
        <div className='bg-white p-6 rounded-lg shadow'>
          <h2 className='text-lg font-semibold mb-4'>Revenue by Month</h2>
          <div className='h-72'>
            <ResponsiveContainer width='100%' height='100%'>
              <BarChart data={data.revenueByMonth}>
                <CartesianGrid strokeDasharray='3 3' />
                <XAxis dataKey='month' />
                <YAxis />
                <Tooltip formatter={(value: number) => [`$${value}`, 'Revenue']} />
                <Bar dataKey='revenue' fill='#8884d8' />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className='bg-white p-6 rounded-lg shadow'>
          <h2 className='text-lg font-semibold mb-4'>Sales by Book</h2>
          <div className='space-y-4'>
            {data.salesByBook.map(
              (item: { bookId: string; title: string; sales: number }, index: number) => (
                <div
                  key={index}
                  className='flex items-center justify-between p-4 bg-gray-50 rounded'
                >
                  <span className='font-medium'>{item.title}</span>
                  <span className='text-gray-600'>${item.sales.toLocaleString()}</span>
                </div>
              ),
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
