import React from 'react';

interface PriceFilterProps {
  min: number;
  max: number;
  onPriceChange: (min: number, max: number) => void;
}

export const PriceFilter: React.FC<PriceFilterProps> = ({ min, max, onPriceChange }) => {
  const handleMinChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newMin = Number(e.target.value);
    if (newMin <= max) {
      onPriceChange(newMin, max);
    }
  };

  const handleMaxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newMax = Number(e.target.value);
    if (newMax >= min) {
      onPriceChange(min, newMax);
    }
  };

  return (
    <div className='flex flex-col space-y-2'>
      <h3 className='text-lg font-semibold'>Price Range</h3>
      <div className='flex items-center space-x-2'>
        <div className='flex flex-col'>
          <label htmlFor='min-price' className='sr-only'>
            Minimum price
          </label>
          <input
            id='min-price'
            type='number'
            value={min}
            onChange={handleMinChange}
            className='w-24 px-2 py-1 border rounded'
            min={0}
            max={max}
            placeholder='Min price'
          />
        </div>
        <span>to</span>
        <div className='flex flex-col'>
          <label htmlFor='max-price' className='sr-only'>
            Maximum price
          </label>
          <input
            id='max-price'
            type='number'
            value={max}
            onChange={handleMaxChange}
            className='w-24 px-2 py-1 border rounded'
            min={min}
            placeholder='Max price'
          />
        </div>
      </div>
    </div>
  );
};
