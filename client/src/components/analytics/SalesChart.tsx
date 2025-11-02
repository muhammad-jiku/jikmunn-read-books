import type { SalesReport } from '@/types/analytics';
import React from 'react';
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

interface Props {
  data: SalesReport['salesByDate'];
}

export const SalesChart: React.FC<Props> = ({ data }) => {
  return (
    <div className='w-full h-72'>
      <ResponsiveContainer width='100%' height='100%'>
        <LineChart
          data={data}
          margin={{
            top: 5,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray='3 3' />
          <XAxis dataKey='date' tickFormatter={(value) => new Date(value).toLocaleDateString()} />
          <YAxis />
          <Tooltip
            labelFormatter={(value) => new Date(value).toLocaleDateString()}
            formatter={(value: number) => [`$${value}`, 'Sales']}
          />
          <Line type='monotone' dataKey='sales' stroke='#8884d8' activeDot={{ r: 8 }} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};
