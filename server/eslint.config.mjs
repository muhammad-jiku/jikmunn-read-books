// eslint.config.mjs
import tsEslint from '@typescript-eslint/eslint-plugin';
import tsParser from '@typescript-eslint/parser';

export default [
  {
    files: ['*.ts', '*.tsx'], // Apply this config only to TypeScript files
    languageOptions: {
      parser: tsParser, // Use TypeScript parser
      ecmaVersion: 2021,
    },
    plugins: {
      '@typescript-eslint': tsEslint, // Use TypeScript ESLint plugin
    },
    rules: {
      'no-unused-vars': 'off', // Disable the base rule as it is handled by TypeScript plugin
      '@typescript-eslint/no-unused-vars': ['error'], // Use TypeScript plugin's rule
      '@typescript-eslint/no-explicit-any': 'error', // Avoid usage of `any`
      '@typescript-eslint/explicit-function-return-type': 'error', // Enforce function return types
      'no-console': 'warn', // Warning for console statements
      'no-undef': 'warn', // Warning for undefined variables
    },
    ignores: ['**/dist/', '**/node_modules/', '.env'], // Ignore specified directories
  },
];
