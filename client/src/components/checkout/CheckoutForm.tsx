import { zodResolver } from '@hookform/resolvers/zod';
import React from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import type { PaymentMethod, ShippingAddress } from '../../types/order';

const checkoutSchema = z.object({
  // Shipping Address
  firstName: z.string().min(2, 'First name is required'),
  lastName: z.string().min(2, 'Last name is required'),
  addressLine1: z.string().min(5, 'Address is required'),
  addressLine2: z.string().optional(),
  city: z.string().min(2, 'City is required'),
  state: z.string().min(2, 'State is required'),
  postalCode: z.string().min(5, 'Valid postal code is required'),
  country: z.string().min(2, 'Country is required'),
  phone: z.string().min(10, 'Valid phone number is required'),

  // Payment Details
  cardNumber: z.string().regex(/^\d{16}$/, 'Valid card number is required'),
  expiryMonth: z.string().regex(/^(0[1-9]|1[0-2])$/, 'Valid month (01-12) is required'),
  expiryYear: z.string().regex(/^\d{4}$/, 'Valid year (YYYY) is required'),
  cvv: z.string().regex(/^\d{3,4}$/, 'Valid CVV is required'),
  nameOnCard: z.string().min(2, 'Name on card is required'),
});

type CheckoutFormData = z.infer<typeof checkoutSchema>;

interface CheckoutFormProps {
  onSubmit: (data: { shippingAddress: ShippingAddress; paymentMethod: PaymentMethod }) => void;
  isSubmitting: boolean;
}

const CheckoutForm: React.FC<CheckoutFormProps> = ({ onSubmit, isSubmitting }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CheckoutFormData>({
    resolver: zodResolver(checkoutSchema),
  });

  const onFormSubmit = (data: CheckoutFormData) => {
    const { cardNumber, expiryMonth, expiryYear, cvv, nameOnCard, ...shippingData } = data;

    onSubmit({
      shippingAddress: shippingData,
      paymentMethod: {
        type: 'credit_card',
        cardNumber,
        expiryMonth,
        expiryYear,
        cvv,
        nameOnCard,
      },
    });
  };

  return (
    <form onSubmit={handleSubmit(onFormSubmit)} className='space-y-8'>
      {/* Shipping Address */}
      <div>
        <h2 className='text-xl font-semibold mb-4'>Shipping Address</h2>
        <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
          <div>
            <label htmlFor='firstName' className='block text-sm font-medium text-gray-700'>
              First Name
            </label>
            <input
              type='text'
              id='firstName'
              {...register('firstName')}
              className='mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500'
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
              id='lastName'
              {...register('lastName')}
              className='mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500'
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
              id='addressLine1'
              {...register('addressLine1')}
              className='mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500'
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
              id='addressLine2'
              {...register('addressLine2')}
              className='mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500'
            />
          </div>

          <div>
            <label htmlFor='city' className='block text-sm font-medium text-gray-700'>
              City
            </label>
            <input
              type='text'
              id='city'
              {...register('city')}
              className='mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500'
            />
            {errors.city && <p className='mt-1 text-sm text-red-600'>{errors.city.message}</p>}
          </div>

          <div>
            <label htmlFor='state' className='block text-sm font-medium text-gray-700'>
              State
            </label>
            <input
              type='text'
              id='state'
              {...register('state')}
              className='mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500'
            />
            {errors.state && <p className='mt-1 text-sm text-red-600'>{errors.state.message}</p>}
          </div>

          <div>
            <label htmlFor='postalCode' className='block text-sm font-medium text-gray-700'>
              Postal Code
            </label>
            <input
              type='text'
              id='postalCode'
              {...register('postalCode')}
              className='mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500'
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
              id='country'
              {...register('country')}
              className='mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500'
            />
            {errors.country && (
              <p className='mt-1 text-sm text-red-600'>{errors.country.message}</p>
            )}
          </div>

          <div>
            <label htmlFor='phone' className='block text-sm font-medium text-gray-700'>
              Phone Number
            </label>
            <input
              type='tel'
              id='phone'
              {...register('phone')}
              className='mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500'
            />
            {errors.phone && <p className='mt-1 text-sm text-red-600'>{errors.phone.message}</p>}
          </div>
        </div>
      </div>

      {/* Payment Information */}
      <div>
        <h2 className='text-xl font-semibold mb-4'>Payment Information</h2>
        <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
          <div className='md:col-span-2'>
            <label htmlFor='cardNumber' className='block text-sm font-medium text-gray-700'>
              Card Number
            </label>
            <input
              type='text'
              id='cardNumber'
              {...register('cardNumber')}
              placeholder='1234 5678 9012 3456'
              className='mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500'
            />
            {errors.cardNumber && (
              <p className='mt-1 text-sm text-red-600'>{errors.cardNumber.message}</p>
            )}
          </div>

          <div className='md:col-span-2'>
            <label htmlFor='nameOnCard' className='block text-sm font-medium text-gray-700'>
              Name on Card
            </label>
            <input
              type='text'
              id='nameOnCard'
              {...register('nameOnCard')}
              className='mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500'
            />
            {errors.nameOnCard && (
              <p className='mt-1 text-sm text-red-600'>{errors.nameOnCard.message}</p>
            )}
          </div>

          <div>
            <label htmlFor='expiryMonth' className='block text-sm font-medium text-gray-700'>
              Expiry Month (MM)
            </label>
            <input
              type='text'
              id='expiryMonth'
              {...register('expiryMonth')}
              placeholder='MM'
              className='mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500'
            />
            {errors.expiryMonth && (
              <p className='mt-1 text-sm text-red-600'>{errors.expiryMonth.message}</p>
            )}
          </div>

          <div>
            <label htmlFor='expiryYear' className='block text-sm font-medium text-gray-700'>
              Expiry Year (YYYY)
            </label>
            <input
              type='text'
              id='expiryYear'
              {...register('expiryYear')}
              placeholder='YYYY'
              className='mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500'
            />
            {errors.expiryYear && (
              <p className='mt-1 text-sm text-red-600'>{errors.expiryYear.message}</p>
            )}
          </div>

          <div>
            <label htmlFor='cvv' className='block text-sm font-medium text-gray-700'>
              CVV
            </label>
            <input
              type='text'
              id='cvv'
              {...register('cvv')}
              className='mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500'
            />
            {errors.cvv && <p className='mt-1 text-sm text-red-600'>{errors.cvv.message}</p>}
          </div>
        </div>
      </div>

      <button
        type='submit'
        disabled={isSubmitting}
        className='w-full bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors disabled:bg-gray-400'
      >
        {isSubmitting ? 'Processing...' : 'Place Order'}
      </button>
    </form>
  );
};

export default CheckoutForm;
