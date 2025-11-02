import React from 'react';
import { Link } from 'react-router-dom';
import type { BookCategory } from '../../types/book';

interface CategoryNavigationProps {
  categories: BookCategory[];
}

const CategoryNavigation: React.FC<CategoryNavigationProps> = ({ categories }) => {
  return (
    <nav className='bg-white shadow-md'>
      <div className='container mx-auto px-4'>
        <ul className='flex items-center gap-6 overflow-x-auto py-4 whitespace-nowrap'>
          {categories.map((category) => (
            <li key={category.id}>
              <Link
                to={`/categories/${category.id}`}
                className='text-gray-600 hover:text-blue-600 transition-colors text-sm md:text-base'
              >
                {category.name}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
};

export default CategoryNavigation;
