import { Star } from 'lucide-react';
import React from 'react';

interface StarRatingProps {
  rating: number;
  maxRating?: number;
  size?: 'sm' | 'md' | 'lg';
  interactive?: boolean;
  onChange?: (rating: number) => void;
}

const StarRating: React.FC<StarRatingProps> = ({
  rating,
  maxRating = 5,
  size = 'md',
  interactive = false,
  onChange,
}) => {
  const [hoverRating, setHoverRating] = React.useState(0);

  const sizes = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6',
  };

  const handleClick = (value: number) => {
    if (interactive && onChange) {
      onChange(value);
    }
  };

  const handleMouseEnter = (value: number) => {
    if (interactive) {
      setHoverRating(value);
    }
  };

  const handleMouseLeave = () => {
    if (interactive) {
      setHoverRating(0);
    }
  };

  return (
    <div className='flex items-center space-x-1'>
      {[...Array(maxRating)].map((_, index) => {
        const value = index + 1;
        const filled = value <= (hoverRating || rating);

        return (
          <button
            key={index}
            type={interactive ? 'button' : 'submit'}
            className={`${interactive ? 'cursor-pointer' : 'cursor-default'} focus:outline-none`}
            onClick={() => handleClick(value)}
            onMouseEnter={() => handleMouseEnter(value)}
            onMouseLeave={handleMouseLeave}
            disabled={!interactive}
            title={`Rate ${value} stars`}
            aria-label={`Rate ${value} stars`}
          >
            <Star
              className={`${sizes[size]} ${
                filled ? 'fill-yellow-400 text-yellow-400' : 'fill-transparent text-gray-300'
              } transition-colors`}
            />
          </button>
        );
      })}
    </div>
  );
};

export default StarRating;
