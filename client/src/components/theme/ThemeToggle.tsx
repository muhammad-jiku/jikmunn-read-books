import { Monitor, Moon, Sun } from 'lucide-react';
import React, { useEffect } from 'react';
import {
  initializeTheme,
  selectSystemPreference,
  selectTheme,
  setSystemPreference,
  setTheme,
} from '../../redux/features/themeSlice';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';

const ThemeToggle: React.FC = () => {
  const dispatch = useAppDispatch();
  const currentTheme = useAppSelector(selectTheme);
  const isSystemPreference = useAppSelector(selectSystemPreference);

  useEffect(() => {
    // Initialize theme on mount
    dispatch(initializeTheme());

    // Listen for system theme changes
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = () => {
      if (isSystemPreference) {
        dispatch(setTheme(mediaQuery.matches ? 'dark' : 'light'));
      }
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [dispatch, isSystemPreference]);

  const handleThemeChange = (theme: 'light' | 'dark' | 'system') => {
    if (theme === 'system') {
      dispatch(setSystemPreference(true));
      const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      dispatch(setTheme(isDark ? 'dark' : 'light'));
    } else {
      dispatch(setSystemPreference(false));
      dispatch(setTheme(theme));
    }
  };

  return (
    <div className='relative inline-block'>
      <div className='flex items-center space-x-2 p-2 rounded-lg bg-gray-100 dark:bg-gray-800'>
        <button
          onClick={() => handleThemeChange('light')}
          className={`p-2 rounded-md transition-colors ${
            currentTheme === 'light' && !isSystemPreference
              ? 'bg-white dark:bg-gray-700 text-yellow-500 shadow-sm'
              : 'text-gray-500 hover:text-yellow-500'
          }`}
          title='Light Mode'
        >
          <Sun className='w-5 h-5' />
        </button>

        <button
          onClick={() => handleThemeChange('dark')}
          className={`p-2 rounded-md transition-colors ${
            currentTheme === 'dark' && !isSystemPreference
              ? 'bg-white dark:bg-gray-700 text-blue-500 shadow-sm'
              : 'text-gray-500 hover:text-blue-500'
          }`}
          title='Dark Mode'
        >
          <Moon className='w-5 h-5' />
        </button>

        <button
          onClick={() => handleThemeChange('system')}
          className={`p-2 rounded-md transition-colors ${
            isSystemPreference
              ? 'bg-white dark:bg-gray-700 text-purple-500 shadow-sm'
              : 'text-gray-500 hover:text-purple-500'
          }`}
          title='System Theme'
        >
          <Monitor className='w-5 h-5' />
        </button>
      </div>
    </div>
  );
};

export default ThemeToggle;
