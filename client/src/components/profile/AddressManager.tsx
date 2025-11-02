import { zodResolver } from '@hookform/resolvers/zod';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import type { AddressUpdateData, UserAddress } from '../../interfaces/address';

const addressSchema = z.object({
  type: z.enum(['shipping', 'billing']),
  isDefault: z.boolean(),
  firstName: z.string().min(2, 'First name must be at least 2 characters'),
  lastName: z.string().min(2, 'Last name must be at least 2 characters'),
  addressLine1: z.string().min(5, 'Address must be at least 5 characters'),
  addressLine2: z.string().optional(),
  city: z.string().min(2, 'City must be at least 2 characters'),
  state: z.string().min(2, 'State must be at least 2 characters'),
  postalCode: z.string().min(4, 'Postal code must be at least 4 characters'),
  country: z.string().min(2, 'Country must be at least 2 characters'),
  phone: z.string().min(10, 'Phone number must be at least 10 characters'),
});

interface AddressFormProps {
  address?: UserAddress;
  onSubmit: (data: AddressUpdateData) => void;
  onCancel: () => void;
  loading: boolean;
}

const AddressForm: React.FC<AddressFormProps> = ({ address, onSubmit, onCancel, loading }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<AddressUpdateData>({
    resolver: zodResolver(addressSchema),
    defaultValues: address || {
      type: 'shipping',
      isDefault: false,
    },
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className='space-y-6'>
      <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
        <div>
          <label htmlFor='type' className='block text-sm font-medium text-gray-700'>
            Address Type
          </label>
          <select
            {...register('type')}
            className='mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500'
          >
            <option value='shipping'>Shipping</option>
            <option value='billing'>Billing</option>
          </select>
        </div>

        <div className='flex items-center'>
          <input
            type='checkbox'
            {...register('isDefault')}
            className='h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500'
          />
          <label htmlFor='isDefault' className='ml-2 block text-sm text-gray-700'>
            Set as default address
          </label>
        </div>

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

        <div className='md:col-span-2'>
          <label htmlFor='addressLine1' className='block text-sm font-medium text-gray-700'>
            Address Line 1
          </label>
          <input
            type='text'
            {...register('addressLine1')}
            className='mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500'
          />
          {errors.addressLine1 && (
            <p className='mt-1 text-sm text-red-600'>{errors.addressLine1.message}</p>
          )}
        </div>

        <div className='md:col-span-2'>
          <label htmlFor='addressLine2' className='block text-sm font-medium text-gray-700'>
            Address Line 2 (Optional)
          </label>
          <input
            type='text'
            {...register('addressLine2')}
            className='mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500'
          />
        </div>

        <div>
          <label htmlFor='city' className='block text-sm font-medium text-gray-700'>
            City
          </label>
          <input
            type='text'
            {...register('city')}
            className='mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500'
          />
          {errors.city && <p className='mt-1 text-sm text-red-600'>{errors.city.message}</p>}
        </div>

        <div>
          <label htmlFor='state' className='block text-sm font-medium text-gray-700'>
            State
          </label>
          <input
            type='text'
            {...register('state')}
            className='mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500'
          />
          {errors.state && <p className='mt-1 text-sm text-red-600'>{errors.state.message}</p>}
        </div>

        <div>
          <label htmlFor='postalCode' className='block text-sm font-medium text-gray-700'>
            Postal Code
          </label>
          <input
            type='text'
            {...register('postalCode')}
            className='mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500'
          />
          {errors.postalCode && (
            <p className='mt-1 text-sm text-red-600'>{errors.postalCode.message}</p>
          )}
        </div>

        <div>
          <label htmlFor='country' className='block text-sm font-medium text-gray-700'>
            Country
          </label>
          <input
            type='text'
            {...register('country')}
            className='mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500'
          />
          {errors.country && <p className='mt-1 text-sm text-red-600'>{errors.country.message}</p>}
        </div>

        <div>
          <label htmlFor='phone' className='block text-sm font-medium text-gray-700'>
            Phone
          </label>
          <input
            type='tel'
            {...register('phone')}
            className='mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500'
          />
          {errors.phone && <p className='mt-1 text-sm text-red-600'>{errors.phone.message}</p>}
        </div>
      </div>

      <div className='flex justify-end space-x-4'>
        <button
          type='button'
          onClick={onCancel}
          className='rounded-md border border-gray-300 bg-white py-2 px-4 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2'
        >
          Cancel
        </button>
        <button
          type='submit'
          disabled={loading}
          className='inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50'
        >
          {loading ? 'Saving...' : 'Save Address'}
        </button>
      </div>
    </form>
  );
};

interface AddressListProps {
  addresses: UserAddress[];
  onEdit: (address: UserAddress) => void;
  onDelete: (id: string) => void;
  onAddNew: () => void;
}

const AddressList: React.FC<AddressListProps> = ({ addresses, onEdit, onDelete, onAddNew }) => {
  return (
    <div className='space-y-6'>
      <div className='flex justify-between items-center'>
        <h3 className='text-lg font-medium text-gray-900'>Saved Addresses</h3>
        <button
          onClick={onAddNew}
          className='inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700'
        >
          Add New Address
        </button>
      </div>

      <div className='grid grid-cols-1 gap-6 sm:grid-cols-2'>
        {addresses.map((address) => (
          <div
            key={address.id}
            className='border rounded-lg p-4 relative hover:shadow-md transition-shadow'
          >
            {address.isDefault && (
              <span className='absolute top-2 right-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800'>
                Default
              </span>
            )}
            <div className='space-y-2'>
              <p className='font-medium'>
                {address.firstName} {address.lastName}
              </p>
              <p className='text-sm text-gray-500'>{address.addressLine1}</p>
              {address.addressLine2 && (
                <p className='text-sm text-gray-500'>{address.addressLine2}</p>
              )}
              <p className='text-sm text-gray-500'>
                {address.city}, {address.state} {address.postalCode}
              </p>
              <p className='text-sm text-gray-500'>{address.country}</p>
              <p className='text-sm text-gray-500'>{address.phone}</p>
              <p className='text-sm font-medium text-gray-500 capitalize'>{address.type} Address</p>
            </div>
            <div className='mt-4 flex justify-end space-x-4'>
              <button
                onClick={() => onEdit(address)}
                className='text-sm text-indigo-600 hover:text-indigo-900'
              >
                Edit
              </button>
              <button
                onClick={() => onDelete(address.id)}
                className='text-sm text-red-600 hover:text-red-900'
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

interface AddressManagerProps {
  addresses: UserAddress[];
  onAddAddress: (data: AddressUpdateData) => void;
  onUpdateAddress: (id: string, data: AddressUpdateData) => void;
  onDeleteAddress: (id: string) => void;
  loading: boolean;
}

const AddressManager: React.FC<AddressManagerProps> = ({
  addresses,
  onAddAddress,
  onUpdateAddress,
  onDeleteAddress,
  loading,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editingAddress, setEditingAddress] = useState<UserAddress | undefined>();

  const handleSubmit = (data: AddressUpdateData) => {
    if (editingAddress) {
      onUpdateAddress(editingAddress.id, data);
    } else {
      onAddAddress(data);
    }
    setIsEditing(false);
    setEditingAddress(undefined);
  };

  const handleEdit = (address: UserAddress) => {
    setEditingAddress(address);
    setIsEditing(true);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditingAddress(undefined);
  };

  return (
    <div className='space-y-8'>
      {isEditing ? (
        <AddressForm
          address={editingAddress}
          onSubmit={handleSubmit}
          onCancel={handleCancel}
          loading={loading}
        />
      ) : (
        <AddressList
          addresses={addresses}
          onEdit={handleEdit}
          onDelete={onDeleteAddress}
          onAddNew={() => setIsEditing(true)}
        />
      )}
    </div>
  );
};

export default AddressManager;
