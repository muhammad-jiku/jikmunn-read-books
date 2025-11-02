import { type SerializedError } from '@reduxjs/toolkit';
import { type FetchBaseQueryError } from '@reduxjs/toolkit/query';

export interface RootState {
  auth: {
    token: string | null;
    user: {
      id: string;
      email: string;
      name: string;
      role: 'user' | 'admin';
    } | null;
  };
  [key: string]: unknown;
}

export type ApiError = FetchBaseQueryError | SerializedError;

export interface ApiErrorResponse {
  status: number;
  message: string;
  error?: string;
  errors?: Record<string, string[]>;
}
