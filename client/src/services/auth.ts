import type { RootState } from '@redux/store';
import baseApi from '../utils/api';

interface LoginRequest {
  email: string;
  password: string;
}

interface RegisterRequest {
  email: string;
  password: string;
  role: 'customer' | 'author';
  name: {
    firstName: string;
    middleName?: string;
    lastName: string;
  };
  gender: 'male' | 'female';
  dateOfBirth: string;
  contactNo: string;
  presentAddress: string;
  permanentAddress: string;
}

interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  user: {
    id: string;
    role: 'customer' | 'author' | 'admin';
    email: string;
  };
}

export const authApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation<AuthResponse, LoginRequest>({
      query: (credentials: LoginRequest) => ({
        url: '/auth/login',
        method: 'POST',
        body: credentials,
      }),
    }),
    register: builder.mutation<AuthResponse, RegisterRequest>({
      query: (data: RegisterRequest) => ({
        url: '/auth/register',
        method: 'POST',
        body: data,
      }),
    }),
    forgotPassword: builder.mutation<{ message: string }, { email: string }>({
      query: (data: { email: string }) => ({
        url: '/auth/forgot-password',
        method: 'POST',
        body: data,
      }),
    }),
    resetPassword: builder.mutation<{ message: string }, { token: string; newPassword: string }>({
      query: (data: { token: string; newPassword: string }) => ({
        url: '/auth/reset-password',
        method: 'POST',
        body: data,
      }),
    }),
    verifyEmail: builder.mutation<{ message: string }, { token: string }>({
      query: (data: { token: string }) => ({
        url: '/auth/verify-email',
        method: 'POST',
        body: data,
      }),
    }),
    refreshToken: builder.query<{ accessToken: string }, void>({
      query: () => '/auth/refresh-token',
    }),
    logout: builder.mutation<{ message: string }, void>({
      query: () => ({
        url: '/auth/logout',
        method: 'POST',
      }),
    }),
  }),
});

export const {
  useLoginMutation,
  useRegisterMutation,
  useForgotPasswordMutation,
  useResetPasswordMutation,
  useVerifyEmailMutation,
  useRefreshTokenQuery,
  useLogoutMutation,
} = authApi;

// Selector to get the authentication status
export const selectCurrentUser = (state: RootState) => state.auth.user;
