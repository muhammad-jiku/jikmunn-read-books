import React from 'react';
import { Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts';

interface Props {
  data: Array<{ category: string; sales: number }>;
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

export const CategoryDistribution: React.FC<Props> = ({ data }) => {
  return (
    <div className='w-full h-72'>
      <ResponsiveContainer width='100%' height='100%'>
        <PieChart>
          <Pie
            data={data}
            dataKey='sales'
            nameKey='category'
            cx='50%'
            cy='50%'
            outerRadius={80}
            label={(props) => props.name}
          >
            {data.map((_, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip formatter={(value: number) => [`$${value}`, 'Sales']} />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};
