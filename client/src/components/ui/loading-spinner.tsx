import { cn } from '@/lib/utils';
import React from 'react';

interface LoadingSpinnerProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: 'sm' | 'md' | 'lg';
  color?: string;
}

export const LoadingSpinner = React.forwardRef<HTMLDivElement, LoadingSpinnerProps>(
  ({ size = 'md', color = 'currentColor', className, ...props }, ref) => {
    const sizeClasses = {
      sm: 'h-4 w-4',
      md: 'h-6 w-6',
      lg: 'h-8 w-8',
    };

    return (
      <div
        ref={ref}
        role='status'
        className={cn('flex items-center justify-center', className)}
        {...props}
      >
        <svg
          className={cn('animate-spin', sizeClasses[size])}
          xmlns='http://www.w3.org/2000/svg'
          fill='none'
          viewBox='0 0 24 24'
          aria-label='Loading'
        >
          <circle className='opacity-25' cx='12' cy='12' r='10' stroke={color} strokeWidth='4' />
          <path
            className='opacity-75'
            fill={color}
            d='M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z'
          />
        </svg>
        <span className='sr-only'>Loading...</span>
      </div>
    );
  },
);
