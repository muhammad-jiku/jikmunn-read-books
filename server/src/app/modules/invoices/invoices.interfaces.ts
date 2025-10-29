import { Model, Types } from 'mongoose';

export type IInvoiceItem = {
  book: Types.ObjectId;
  title: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  ebookAccess: boolean;
};

export type IInvoice = {
  _id?: Types.ObjectId;
  invoiceNumber: string;
  order: Types.ObjectId;
  user: Types.ObjectId;
  invoiceDate: Date;
  dueDate: Date;
  items: IInvoiceItem[];
  subtotal: number;
  vat: number;
  surcharge: number;
  discount: number;
  totalAmount: number;
  paymentStatus: 'pending' | 'paid' | 'overdue' | 'cancelled';
  billingAddress: {
    name: string;
    address: string;
    city: string;
    state: string;
    postcode: string;
    country: string;
    phone: string;
    email: string;
  };
  shippingAddress: {
    name: string;
    address: string;
    city: string;
    state: string;
    postcode: string;
    country: string;
    phone: string;
  };
  paymentMethod: string;
  transactionId?: string;
  notes?: string;
  terms?: string;
  isGenerated: boolean;
  generatedAt?: Date;
};

export type IInvoiceModel = Model<IInvoice, Record<string, unknown>>;

export type IInvoiceFilters = {
  searchTerm?: string;
  invoiceNumber?: string;
  user?: string;
  paymentStatus?: string;
  startDate?: string;
  endDate?: string;
  minAmount?: number;
  maxAmount?: number;
};
