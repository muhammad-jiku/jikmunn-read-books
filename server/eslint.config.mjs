// eslint.config.mjs
import tsEslint from '@typescript-eslint/eslint-plugin';
import tsParser from '@typescript-eslint/parser';

export default [
  {
    files: ['**/*.ts', '**/*.tsx'], // Apply this config to all TypeScript files in the project
    languageOptions: {
      parser: tsParser, // Use TypeScript parser
      ecmaVersion: 2021,
      globals: {
        myGlobalVariable: 'readonly',
        process: 'readonly',
      },
    },
    plugins: {
      '@typescript-eslint': tsEslint, // Use TypeScript ESLint plugin
    },
    rules: {
      'no-undef': 'warn',
      'no-console': 'warn',
      'no-unused-expressions': 'warn',
      'no-unused-vars': 'error',
      'no-unreachable': 'error',
      'prefer-const': 'error',
      '@typescript-eslint/no-explicit-any': 'error',
      // '@typescript-eslint/consistent-type-definitions': ['error', 'type'], // Use 'interface' or 'type'
      '@typescript-eslint/explicit-function-return-type': 'warn',
      '@typescript-eslint/no-empty-function': 'warn',
      '@typescript-eslint/no-inferrable-types': 'warn',
    },
  },
  {
    ignores: ['**/dist/', '**/node_modules/', '.env'], // Ignore specified directories
  },
];
