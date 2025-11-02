import AddressManager from '@components/profile/AddressManager';
import ProfileForm from '@components/profile/ProfileForm';
import {
  addAddress,
  deleteAddress,
  fetchProfile,
  selectProfile,
  selectProfileError,
  selectProfileLoading,
  updateAddress,
  updateProfile,
} from '@redux/features/profileSlice';
import { useAppDispatch, useAppSelector } from '@redux/hooks';
import type { AddressUpdateData, ProfileUpdateData } from '@types/profile';
import React, { useEffect, useState } from 'react';

const ProfilePage: React.FC = () => {
  const dispatch = useAppDispatch();
  const profile = useAppSelector(selectProfile);
  const loading = useAppSelector(selectProfileLoading);
  const error = useAppSelector(selectProfileError);
  const [activeTab, setActiveTab] = useState<'profile' | 'addresses'>('profile');

  useEffect(() => {
    dispatch(fetchProfile());
  }, [dispatch]);

  const handleUpdateProfile = async (data: ProfileUpdateData) => {
    await dispatch(updateProfile(data));
  };

  const handleAddAddress = async (data: AddressUpdateData) => {
    await dispatch(addAddress(data));
  };

  const handleUpdateAddress = async (id: string, data: AddressUpdateData) => {
    await dispatch(updateAddress({ id, data }));
  };

  const handleDeleteAddress = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this address?')) {
      await dispatch(deleteAddress(id));
    }
  };

  if (error) {
    return (
      <div className='min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8'>
        <div className='max-w-7xl mx-auto'>
          <div className='bg-white shadow rounded-lg p-6'>
            <div className='text-red-600'>Error: {error}</div>
          </div>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className='min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8'>
        <div className='max-w-7xl mx-auto'>
          <div className='bg-white shadow rounded-lg p-6'>
            <div className='text-center'>Loading profile...</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className='min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8'>
      <div className='max-w-7xl mx-auto'>
        <div className='bg-white shadow rounded-lg'>
          <div className='border-b border-gray-200'>
            <nav className='-mb-px flex'>
              <button
                onClick={() => setActiveTab('profile')}
                className={`w-1/2 py-4 px-1 text-center border-b-2 text-sm font-medium ${
                  activeTab === 'profile'
                    ? 'border-indigo-500 text-indigo-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Profile Settings
              </button>
              <button
                onClick={() => setActiveTab('addresses')}
                className={`w-1/2 py-4 px-1 text-center border-b-2 text-sm font-medium ${
                  activeTab === 'addresses'
                    ? 'border-indigo-500 text-indigo-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Manage Addresses
              </button>
            </nav>
          </div>

          <div className='p-6'>
            {activeTab === 'profile' ? (
              <div className='space-y-6'>
                <div>
                  <h3 className='text-lg font-medium text-gray-900'>Profile Information</h3>
                  <p className='mt-1 text-sm text-gray-500'>
                    Update your personal information and preferences.
                  </p>
                </div>
                <ProfileForm profile={profile} onSubmit={handleUpdateProfile} loading={loading} />
              </div>
            ) : (
              <div className='space-y-6'>
                <div>
                  <h3 className='text-lg font-medium text-gray-900'>Address Book</h3>
                  <p className='mt-1 text-sm text-gray-500'>
                    Manage your shipping and billing addresses.
                  </p>
                </div>
                <AddressManager
                  addresses={profile.addresses}
                  onAddAddress={handleAddAddress}
                  onUpdateAddress={handleUpdateAddress}
                  onDeleteAddress={handleDeleteAddress}
                  loading={loading}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
