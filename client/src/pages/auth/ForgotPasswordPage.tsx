import { useForgotPasswordMutation } from '@/services/auth';
import type { ApiError } from '@/types/api';
import { forgotPasswordSchema, type ForgotPasswordFormData } from '@/validations/auth';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Link } from 'react-router-dom';

const ForgotPasswordPage = () => {
  const [forgotPassword, { isLoading }] = useForgotPasswordMutation();

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
  });

  const onSubmit = async (data: ForgotPasswordFormData) => {
    try {
      await forgotPassword(data).unwrap();
      // Show success message or redirect
    } catch (error: unknown) {
      const apiError = error as ApiError;
      if ('status' in apiError && apiError.status === 404) {
        setError('email', {
          type: 'manual',
          message: 'No account found with this email',
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
          <p className='mt-2 text-center text-sm text-gray-600'>
            Enter your email address and we'll send you a link to reset your password.
          </p>
        </div>
        <form className='mt-8 space-y-6' onSubmit={handleSubmit(onSubmit)}>
          <div>
            <label htmlFor='email' className='sr-only'>
              Email address
            </label>
            <input
              {...register('email')}
              id='email'
              type='email'
              className='appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-primary focus:border-primary focus:z-10 sm:text-sm'
              placeholder='Email address'
            />
            {errors.email && <p className='mt-1 text-sm text-red-600'>{errors.email.message}</p>}
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
              {isLoading ? 'Sending...' : 'Send reset link'}
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

export default ForgotPasswordPage;
