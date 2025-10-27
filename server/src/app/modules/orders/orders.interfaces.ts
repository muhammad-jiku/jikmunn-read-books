import { Model, Types } from 'mongoose';

export type IOrderItem = {
  book: Types.ObjectId;
  quantity: number;
  price: number;
  ebookAccess: boolean;
};

export type IShippingAddress = {
  name: string;
  address: string;
  city: string;
  state: string;
  postcode: string;
  country: string;
  phone: string;
};

export type IOrder = {
  _id?: Types.ObjectId;
  user: Types.ObjectId;
  items: IOrderItem[];
  totalAmount: number;
  vat: number;
  surcharge: number;
  payable: number;
  shippingAddress: IShippingAddress;
  paymentMethod: string;
  paymentStatus:
    | 'pending'
    | 'processing'
    | 'completed'
    | 'failed'
    | 'cancelled'
    | 'refunded';
  deliveryStatus:
    | 'pending'
    | 'confirmed'
    | 'shipped'
    | 'delivered'
    | 'cancelled';
  tran_id?: string;
  val_id?: string;
  paymentGateway: string;
  orderNotes?: string;
  estimatedDelivery?: Date;
  deliveredAt?: Date;
  cancelledAt?: Date;
  cancellationReason?: string;
};

export type IOrderModel = Model<IOrder, Record<string, unknown>>;

export type IOrderFilters = {
  searchTerm?: string;
  user?: string;
  paymentStatus?: string;
  deliveryStatus?: string;
  paymentMethod?: string;
  startDate?: string;
  endDate?: string;
  minAmount?: number;
  maxAmount?: number;
};
