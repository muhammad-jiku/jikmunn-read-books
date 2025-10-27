export const orderSearchableFields = [
  'tran_id',
  'val_id',
  'shippingAddress.name',
  'shippingAddress.phone',
];

export const orderFilterableFields = [
  'searchTerm',
  'user',
  'paymentStatus',
  'deliveryStatus',
  'paymentMethod',
  'paymentGateway',
  'startDate',
  'endDate',
  'minAmount',
  'maxAmount',
];

export const paymentStatus = [
  'pending',
  'processing',
  'completed',
  'failed',
  'cancelled',
  'refunded',
];

export const deliveryStatus = [
  'pending',
  'confirmed',
  'shipped',
  'delivered',
  'cancelled',
];

export const paymentMethods = [
  'card',
  'bkash',
  'nagad',
  'rocket',
  'bank',
  'cod',
];
