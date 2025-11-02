import { useLoginMutation } from '@/services/auth';
import { setCredentials } from '@/store/slices/authSlice';
import type { ApiError } from '@/types/api';
import { loginSchema, type LoginFormData } from '@/validations/auth';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch } from 'react-redux';
import { Link, useLocation, useNavigate } from 'react-router-dom';

const LoginPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const [login, { isLoading }] = useLoginMutation();

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    try {
      const response = await login(data).unwrap();
      dispatch(
        setCredentials({
          user: response.user,
          token: response.accessToken,
          refreshToken: response.refreshToken,
        }),
      );

      const from = location.state?.from?.pathname || '/';
      navigate(from, { replace: true });
    } catch (error: unknown) {
      const apiError = error as ApiError;
      if ('status' in apiError && apiError.status === 401) {
        setError('root', {
          type: 'manual',
          message: 'Invalid email or password',
        });
      } else {
        setError('root', {
          type: 'manual',
          message: 'Something went wrong. Please try again.',
        });
      }
    }
  };

  return (
    <div className='min-h-screen flex items-center justify-center bg-gray-50'>
      <div className='max-w-md w-full space-y-8 p-6 bg-white rounded-lg shadow-md'>
        <div>
          <h2 className='mt-6 text-center text-3xl font-extrabold text-gray-900'>
            Sign in to your account
          </h2>
        </div>
        <form className='mt-8 space-y-6' onSubmit={handleSubmit(onSubmit)}>
          <div className='rounded-md shadow-sm -space-y-px'>
            <div>
              <label htmlFor='email' className='sr-only'>
                Email address
              </label>
              <input
                {...register('email')}
                id='email'
                type='email'
                className='appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-primary focus:border-primary focus:z-10 sm:text-sm'
                placeholder='Email address'
              />
              {errors.email && <p className='mt-1 text-sm text-red-600'>{errors.email.message}</p>}
            </div>
            <div>
              <label htmlFor='password' className='sr-only'>
                Password
              </label>
              <div className='relative'>
                <input
                  {...register('password')}
                  id='password'
                  type={showPassword ? 'text' : 'password'}
                  className='appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-primary focus:border-primary focus:z-10 sm:text-sm'
                  placeholder='Password'
                />
                <button
                  type='button'
                  className='absolute inset-y-0 right-0 pr-3 flex items-center'
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? 'Hide' : 'Show'}
                </button>
              </div>
              {errors.password && (
                <p className='mt-1 text-sm text-red-600'>{errors.password.message}</p>
              )}
            </div>
          </div>

          {errors.root && (
            <p className='mt-2 text-sm text-red-600 text-center'>{errors.root.message}</p>
          )}

          <div className='flex items-center justify-between'>
            <div className='text-sm'>
              <Link
                to='/auth/forgot-password'
                className='font-medium text-primary hover:text-primary-dark'
              >
                Forgot your password?
              </Link>
            </div>
          </div>

          <div>
            <button
              type='submit'
              disabled={isLoading}
              className='group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary'
            >
              {isLoading ? 'Signing in...' : 'Sign in'}
            </button>
          </div>
        </form>

        <div className='text-center'>
          <p className='mt-2 text-sm text-gray-600'>
            Don't have an account?{' '}
            <Link to='/auth/register' className='font-medium text-primary hover:text-primary-dark'>
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
