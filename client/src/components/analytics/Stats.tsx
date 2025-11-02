import React from 'react';

interface Stat {
  label: string;
  value: string | number;
  change?: number;
}

interface Props {
  stats: Stat[];
}

export const Stats: React.FC<Props> = ({ stats }) => {
  return (
    <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4'>
      {stats.map((stat, index) => (
        <div key={index} className='bg-white rounded-lg shadow px-6 py-4'>
          <p className='text-sm font-medium text-gray-600'>{stat.label}</p>
          <p className='mt-2 text-3xl font-semibold text-gray-900'>{stat.value}</p>
          {stat.change !== undefined && (
            <div className='mt-2'>
              <span className={`text-sm ${stat.change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {stat.change >= 0 ? '+' : ''}
                {stat.change}%
              </span>
              <span className='text-sm text-gray-500 ml-2'>vs last period</span>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};
