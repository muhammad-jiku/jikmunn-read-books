export const invoiceSearchableFields = [
  'invoiceNumber',
  'billingAddress.name',
  'billingAddress.email',
  'transactionId',
];

export const invoiceFilterableFields = [
  'searchTerm',
  'invoiceNumber',
  'user',
  'paymentStatus',
  'startDate',
  'endDate',
  'minAmount',
  'maxAmount',
];
