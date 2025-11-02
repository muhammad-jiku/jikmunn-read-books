import { useResetPasswordMutation } from '@/services/auth';
import type { ApiError } from '@/types/api';
import { resetPasswordSchema, type ResetPasswordFormData } from '@/validations/auth';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate, useParams } from 'react-router-dom';

const ResetPasswordPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const { token } = useParams();
  const [resetPassword, { isLoading }] = useResetPasswordMutation();

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm<ResetPasswordFormData>({
    resolver: zodResolver(resetPasswordSchema),
  });

  const onSubmit = async (data: ResetPasswordFormData) => {
    if (!token) {
      setError('root', {
        type: 'manual',
        message: 'Reset token is missing',
      });
      return;
    }

    try {
      await resetPassword({ ...data, token }).unwrap();
      navigate('/auth/login', {
        state: { message: 'Password reset successful! Please login with your new password.' },
      });
    } catch (error: unknown) {
      const apiError = error as ApiError;
      if ('status' in apiError && apiError.status === 400) {
        setError('root', {
          type: 'manual',
          message: 'Invalid or expired reset token',
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
            Reset your password
          </h2>
          <p className='mt-2 text-center text-sm text-gray-600'>Please enter your new password.</p>
        </div>
        <form className='mt-8 space-y-6' onSubmit={handleSubmit(onSubmit)}>
          <div className='rounded-md shadow-sm -space-y-px'>
            <div>
              <label htmlFor='password' className='sr-only'>
                New Password
              </label>
              <div className='relative'>
                <input
                  {...register('password')}
                  id='password'
                  type={showPassword ? 'text' : 'password'}
                  className='appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-primary focus:border-primary focus:z-10 sm:text-sm'
                  placeholder='New Password'
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
            <div>
              <label htmlFor='confirmPassword' className='sr-only'>
                Confirm New Password
              </label>
              <div className='relative'>
                <input
                  {...register('confirmPassword')}
                  id='confirmPassword'
                  type={showPassword ? 'text' : 'password'}
                  className='appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-primary focus:border-primary focus:z-10 sm:text-sm'
                  placeholder='Confirm New Password'
                />
                <button
                  type='button'
                  className='absolute inset-y-0 right-0 pr-3 flex items-center'
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? 'Hide' : 'Show'}
                </button>
              </div>
              {errors.confirmPassword && (
                <p className='mt-1 text-sm text-red-600'>{errors.confirmPassword.message}</p>
              )}
            </div>
          </div>

          {errors.root && (
            <p className='mt-2 text-sm text-red-600 text-center'>{errors.root.message}</p>
          )}

          <div>
            <button
              type='submit'
              disabled={isLoading}
              className='group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary'
            >
              {isLoading ? 'Resetting password...' : 'Reset password'}
            </button>
          </div>
        </form>

        <div className='text-center'>
          <p className='mt-2 text-sm text-gray-600'>
            Remember your password?{' '}
            <Link to='/auth/login' className='font-medium text-primary hover:text-primary-dark'>
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default ResetPasswordPage;
