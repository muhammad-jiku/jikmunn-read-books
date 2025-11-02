export type Theme = 'light' | 'dark';

export interface ThemeState {
  theme: Theme;
  systemPreference: boolean; // If true, follow system preference
}

export interface ThemeColors {
  primary: string;
  background: string;
  text: string;
  border: string;
  accent: string;
}
