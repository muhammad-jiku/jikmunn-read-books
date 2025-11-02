import { zodResolver } from '@hookform/resolvers/zod';
import React from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import type { ProfileUpdateData, UserProfile } from '../../interfaces/profile';

const profileSchema = z
  .object({
    firstName: z.string().min(2, 'First name must be at least 2 characters').optional(),
    lastName: z.string().min(2, 'Last name must be at least 2 characters').optional(),
    phone: z.string().optional(),
    dateOfBirth: z.string().optional(),
    preferences: z
      .object({
        emailNotifications: z.boolean(),
        orderUpdates: z.boolean(),
        newReleases: z.boolean(),
        recommendations: z.boolean(),
        newsletter: z.boolean(),
        language: z.string(),
        currency: z.string(),
      })
      .partial()
      .optional(),
  })
  .partial();

interface ProfileFormProps {
  profile: UserProfile;
  onSubmit: (data: ProfileUpdateData) => void;
  loading: boolean;
}

const ProfileForm: React.FC<ProfileFormProps> = ({ profile, onSubmit, loading }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ProfileUpdateData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      firstName: profile.firstName,
      lastName: profile.lastName,
      phone: profile.phone,
      dateOfBirth: profile.dateOfBirth,
      preferences: profile.preferences,
    },
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className='space-y-6'>
      <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
        <div>
          <label htmlFor='firstName' className='block text-sm font-medium text-gray-700'>
            First Name
          </label>
          <input
            type='text'
            {...register('firstName')}
            className='mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500'
          />
          {errors.firstName && (
            <p className='mt-1 text-sm text-red-600'>{errors.firstName.message}</p>
          )}
        </div>

        <div>
          <label htmlFor='lastName' className='block text-sm font-medium text-gray-700'>
            Last Name
          </label>
          <input
            type='text'
            {...register('lastName')}
            className='mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500'
          />
          {errors.lastName && (
            <p className='mt-1 text-sm text-red-600'>{errors.lastName.message}</p>
          )}
        </div>

        <div>
          <label htmlFor='phone' className='block text-sm font-medium text-gray-700'>
            Phone Number
          </label>
          <input
            type='tel'
            {...register('phone')}
            className='mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500'
          />
        </div>

        <div>
          <label htmlFor='dateOfBirth' className='block text-sm font-medium text-gray-700'>
            Date of Birth
          </label>
          <input
            type='date'
            {...register('dateOfBirth')}
            className='mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500'
          />
        </div>
      </div>

      <div className='space-y-4'>
        <h3 className='text-lg font-medium text-gray-900'>Preferences</h3>

        <div className='space-y-2'>
          <div className='flex items-center'>
            <input
              type='checkbox'
              {...register('preferences.emailNotifications')}
              className='h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500'
            />
            <label htmlFor='emailNotifications' className='ml-2 block text-sm text-gray-700'>
              Email Notifications
            </label>
          </div>

          <div className='flex items-center'>
            <input
              type='checkbox'
              {...register('preferences.orderUpdates')}
              className='h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500'
            />
            <label htmlFor='orderUpdates' className='ml-2 block text-sm text-gray-700'>
              Order Updates
            </label>
          </div>

          <div className='flex items-center'>
            <input
              type='checkbox'
              {...register('preferences.newReleases')}
              className='h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500'
            />
            <label htmlFor='newReleases' className='ml-2 block text-sm text-gray-700'>
              New Releases
            </label>
          </div>

          <div className='flex items-center'>
            <input
              type='checkbox'
              {...register('preferences.recommendations')}
              className='h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500'
            />
            <label htmlFor='recommendations' className='ml-2 block text-sm text-gray-700'>
              Book Recommendations
            </label>
          </div>

          <div className='flex items-center'>
            <input
              type='checkbox'
              {...register('preferences.newsletter')}
              className='h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500'
            />
            <label htmlFor='newsletter' className='ml-2 block text-sm text-gray-700'>
              Newsletter Subscription
            </label>
          </div>
        </div>

        <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
          <div>
            <label htmlFor='language' className='block text-sm font-medium text-gray-700'>
              Language
            </label>
            <select
              {...register('preferences.language')}
              className='mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500'
            >
              <option value='en'>English</option>
              <option value='es'>Spanish</option>
              <option value='fr'>French</option>
              <option value='de'>German</option>
            </select>
          </div>

          <div>
            <label htmlFor='currency' className='block text-sm font-medium text-gray-700'>
              Currency
            </label>
            <select
              {...register('preferences.currency')}
              className='mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500'
            >
              <option value='USD'>USD ($)</option>
              <option value='EUR'>EUR (€)</option>
              <option value='GBP'>GBP (£)</option>
              <option value='JPY'>JPY (¥)</option>
            </select>
          </div>
        </div>
      </div>

      <div className='flex justify-end'>
        <button
          type='submit'
          disabled={loading}
          className='inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50'
        >
          {loading ? 'Saving...' : 'Save Changes'}
        </button>
      </div>
    </form>
  );
};

export default ProfileForm;
