import type { RootState } from '@redux/store';
import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { Theme, ThemeState } from '@types/theme';

const getInitialTheme = (): Theme => {
  // Check localStorage first
  const savedTheme = localStorage.getItem('theme') as Theme | null;
  if (savedTheme) {
    return savedTheme;
  }

  // Check system preference
  if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
    return 'dark';
  }

  return 'light';
};

const getInitialSystemPreference = (): boolean => {
  const savedPreference = localStorage.getItem('systemPreference');
  return savedPreference ? JSON.parse(savedPreference) : true;
};

const initialState: ThemeState = {
  theme: getInitialTheme(),
  systemPreference: getInitialSystemPreference(),
};

const themeSlice = createSlice({
  name: 'theme',
  initialState,
  reducers: {
    setTheme: (state, action: PayloadAction<Theme>) => {
      state.theme = action.payload;
      state.systemPreference = false;
      localStorage.setItem('theme', action.payload);
      localStorage.setItem('systemPreference', 'false');
      // Apply theme to document
      document.documentElement.classList.remove('light', 'dark');
      document.documentElement.classList.add(action.payload);
    },
    setSystemPreference: (state, action: PayloadAction<boolean>) => {
      state.systemPreference = action.payload;
      localStorage.setItem('systemPreference', JSON.stringify(action.payload));
      if (action.payload) {
        // If using system preference, update theme accordingly
        const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        state.theme = isDark ? 'dark' : 'light';
        document.documentElement.classList.remove('light', 'dark');
        document.documentElement.classList.add(state.theme);
      }
    },
    initializeTheme: (state) => {
      // Apply current theme to document
      document.documentElement.classList.remove('light', 'dark');
      document.documentElement.classList.add(state.theme);
    },
  },
});

export const { setTheme, setSystemPreference, initializeTheme } = themeSlice.actions;

export const selectTheme = (state: RootState) => state.theme.theme;
export const selectSystemPreference = (state: RootState) => state.theme.systemPreference;

export default themeSlice.reducer;
