import type { SerializedError } from '@reduxjs/toolkit';
import type { FetchBaseQueryError } from '@reduxjs/toolkit/query';

export type ApiError = FetchBaseQueryError | SerializedError;

export interface ApiErrorResponse {
  status: number;
  data: {
    message: string;
    code?: string;
    errors?: Record<string, string[]>;
  };
}
