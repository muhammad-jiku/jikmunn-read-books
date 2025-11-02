import {
  initializeTheme,
  selectSystemPreference,
  selectTheme,
  setTheme,
} from '@redux/features/themeSlice';
import { useAppDispatch, useAppSelector } from '@redux/hooks';
import React, { useEffect } from 'react';

interface ThemeProviderProps {
  children: React.ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const dispatch = useAppDispatch();
  // Using currentTheme to set the document class
  const currentTheme = useAppSelector(selectTheme);
  const isSystemPreference = useAppSelector(selectSystemPreference);

  useEffect(() => {
    // Initialize theme on mount
    dispatch(initializeTheme());

    // Set up system theme change listener
    if (isSystemPreference) {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      const handleChange = (e: MediaQueryListEvent) => {
        dispatch(setTheme(e.matches ? 'dark' : 'light'));
      };

      // Add listener
      mediaQuery.addEventListener('change', handleChange);

      // Cleanup
      return () => mediaQuery.removeEventListener('change', handleChange);
    }
  }, [dispatch, isSystemPreference]);

  useEffect(() => {
    document.documentElement.classList.remove('light', 'dark');
    document.documentElement.classList.add(currentTheme);
  }, [currentTheme]);

  return <>{children}</>;
};

export default ThemeProvider;
