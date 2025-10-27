/* eslint-disable @typescript-eslint/no-explicit-any */
import httpStatus from 'http-status';
import mongoose, { SortOrder } from 'mongoose';
import ApiError from '../../../errors/ApiError';
import { paginationHelpers } from '../../../helpers/paginationHelpers';
import { IGenericResponse } from '../../../interfaces/common';
import { IPaginationOptions } from '../../../interfaces/pagination';
import { IOrder } from '../orders/orders.interfaces';
import { Order } from '../orders/orders.model';
import { User } from '../users/users.model';
import { paymentSearchableFields } from './payments.constants';
import { IPayment, IPaymentFilters } from './payments.interfaces';
import { Payment } from './payments.model';

// SSLCommerz configuration (should be in config)
// eslint-disable-next-line no-undef
const SSLCommerzPayment = require('sslcommerz-lts');

const initSSLCommerzPayment = async (
  order: IOrder & { _id: mongoose.Types.ObjectId },
): Promise<{ paymentUrl: string; transactionId: string }> => {
  const store_id = process.env.SSLCOMMERZ_STORE_ID;
  const store_passwd = process.env.SSLCOMMERZ_STORE_PASSWORD;
  const is_live = process.env.NODE_ENV === 'production';

  if (!store_id || !store_passwd) {
    throw new ApiError(
      httpStatus.INTERNAL_SERVER_ERROR,
      'Payment gateway configuration missing',
    );
  }

  const transactionId = `TXN${Date.now()}${Math.random().toString(36).substr(2, 9)}`;

  const data = {
    total_amount: order.payable,
    currency: 'BDT',
    tran_id: transactionId,
    success_url: `${process.env.FRONTEND_URL}/payment/success?transactionId=${transactionId}`,
    fail_url: `${process.env.FRONTEND_URL}/payment/fail?transactionId=${transactionId}`,
    cancel_url: `${process.env.FRONTEND_URL}/payment/cancel?transactionId=${transactionId}`,
    ipn_url: `${process.env.BACKEND_URL}/api/v1/payments/ipn`,
    shipping_method: 'Courier',
    product_name: 'Books',
    product_category: 'Books',
    product_profile: 'general',
    cus_name: order.shippingAddress.name,
    cus_email: 'customer@example.com', // You should get from user
    cus_add1: order.shippingAddress.address,
    cus_city: order.shippingAddress.city,
    cus_state: order.shippingAddress.state,
    cus_postcode: order.shippingAddress.postcode,
    cus_country: order.shippingAddress.country,
    cus_phone: order.shippingAddress.phone,
    ship_name: order.shippingAddress.name,
    ship_add1: order.shippingAddress.address,
    ship_city: order.shippingAddress.city,
    ship_state: order.shippingAddress.state,
    ship_postcode: order.shippingAddress.postcode,
    ship_country: order.shippingAddress.country,
  };

  const sslcz = new SSLCommerzPayment(store_id, store_passwd, is_live);
  const apiResponse = await sslcz.init(data);

  if (!apiResponse.GatewayPageURL) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Failed to initialize payment');
  }

  // Create a pending payment record
  const paymentData: IPayment = {
    order: order._id,
    user: order.user,
    paymentGateway: 'sslcommerz',
    transactionId: transactionId,
    amount: order.payable,
    currency: 'BDT',
    status: 'pending',
    gatewayResponse: apiResponse,
  };

  await Payment.create(paymentData);

  return {
    paymentUrl: apiResponse.GatewayPageURL,
    transactionId,
  };
};

const initPayment = async (
  orderId: string,
  userId: string,
): Promise<{ paymentUrl: string; transactionId: string }> => {
  const session = await mongoose.startSession();
  try {
    session.startTransaction();

    const user = await User.findOne({ id: userId }).session(session);
    if (!user) {
      throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
    }

    const order = await Order.findOne({ _id: orderId, user: user._id }).session(
      session,
    );
    if (!order) {
      throw new ApiError(httpStatus.NOT_FOUND, 'Order not found');
    }

    if (order.paymentStatus !== 'pending') {
      throw new ApiError(
        httpStatus.BAD_REQUEST,
        'Order payment already processed',
      );
    }

    // Check if payment already exists
    const existingPayment = await Payment.findOne({ order: order._id }).session(
      session,
    );
    if (existingPayment) {
      throw new ApiError(
        httpStatus.BAD_REQUEST,
        'Payment already initiated for this order',
      );
    }

    let paymentResult;
    if (order.paymentGateway === 'sslcommerz') {
      paymentResult = await initSSLCommerzPayment(order);
    } else {
      throw new ApiError(httpStatus.BAD_REQUEST, 'Unsupported payment gateway');
    }

    await session.commitTransaction();
    await session.endSession();

    return paymentResult;
  } catch (error) {
    await session.abortTransaction();
    await session.endSession();
    throw error;
  }
};

const handleIPN = async (
  transactionId: string,
  status: string,
  gatewayResponse: any,
): Promise<IPayment | null> => {
  const session = await mongoose.startSession();
  try {
    session.startTransaction();

    const payment = await Payment.findOne({ transactionId }).session(session);
    if (!payment) {
      throw new ApiError(httpStatus.NOT_FOUND, 'Payment not found');
    }

    // Validate and convert status to the correct type
    let paymentStatus:
      | 'pending'
      | 'processing'
      | 'completed'
      | 'failed'
      | 'cancelled'
      | 'refunded';
    switch (status) {
      case 'pending':
        paymentStatus = 'pending';
        break;
      case 'processing':
        paymentStatus = 'processing';
        break;
      case 'completed':
        paymentStatus = 'completed';
        break;
      case 'failed':
        paymentStatus = 'failed';
        break;
      case 'cancelled':
        paymentStatus = 'cancelled';
        break;
      case 'refunded':
        paymentStatus = 'refunded';
        break;
      default:
        throw new ApiError(httpStatus.BAD_REQUEST, 'Invalid payment status');
    }

    // Update payment status
    payment.status = paymentStatus;
    payment.gatewayResponse = gatewayResponse;
    if (paymentStatus === 'completed') {
      payment.paymentDate = new Date();
    }
    await payment.save({ session });

    // Update order payment status
    const order = await Order.findById(payment.order).session(session);
    if (order) {
      // Convert order payment status as well
      let orderPaymentStatus:
        | 'pending'
        | 'processing'
        | 'completed'
        | 'failed'
        | 'cancelled'
        | 'refunded';
      switch (status) {
        case 'pending':
          orderPaymentStatus = 'pending';
          break;
        case 'processing':
          orderPaymentStatus = 'processing';
          break;
        case 'completed':
          orderPaymentStatus = 'completed';
          break;
        case 'failed':
          orderPaymentStatus = 'failed';
          break;
        case 'cancelled':
          orderPaymentStatus = 'cancelled';
          break;
        case 'refunded':
          orderPaymentStatus = 'refunded';
          break;
        default:
          throw new ApiError(httpStatus.BAD_REQUEST, 'Invalid payment status');
      }

      order.paymentStatus = orderPaymentStatus;
      order.val_id = gatewayResponse.val_id || transactionId;

      if (paymentStatus === 'completed') {
        // If payment completed, update order status to confirmed
        order.deliveryStatus = 'confirmed';

        // Here you can trigger other actions like:
        // - Send confirmation email
        // - Update inventory
        // - Grant ebook access
      } else if (paymentStatus === 'failed' || paymentStatus === 'cancelled') {
        // Restore book stock if payment failed
        for (const item of order.items) {
          const book = await mongoose
            .model('Book')
            .findById(item.book)
            .session(session);
          if (book) {
            book.stock += item.quantity;
            book.isAvailable = true;
            await book.save({ session });
          }
        }
      }

      await order.save({ session });
    }

    await session.commitTransaction();
    await session.endSession();

    return payment;
  } catch (error) {
    await session.abortTransaction();
    await session.endSession();
    throw error;
  }
};

const getPayment = async (transactionId: string): Promise<IPayment | null> => {
  const payment = await Payment.findOne({ transactionId })
    .populate('order')
    .populate('user');

  if (!payment) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Payment not found');
  }

  return payment;
};

const getAllPayments = async (
  filters: IPaymentFilters,
  paginationOptions: IPaginationOptions,
): Promise<IGenericResponse<IPayment[]>> => {
  const { searchTerm, ...filtersData } = filters;
  const { page, limit, skip, sortBy, sortOrder } =
    paginationHelpers.calculatePagination(paginationOptions);

  const andConditions = [];

  if (searchTerm) {
    andConditions.push({
      $or: paymentSearchableFields.map(field => ({
        [field]: {
          $regex: searchTerm,
          $options: 'i',
        },
      })),
    });
  }

  if (Object.keys(filtersData).length) {
    andConditions.push({
      $and: Object.entries(filtersData).map(([field, value]) => {
        if (field === 'startDate' || field === 'endDate') {
          return {};
        }
        return { [field]: value };
      }),
    });
  }

  // Date range filter
  if (filtersData.startDate || filtersData.endDate) {
    const dateFilter: any = {};
    if (filtersData.startDate) {
      dateFilter.$gte = new Date(filtersData.startDate);
    }
    if (filtersData.endDate) {
      dateFilter.$lte = new Date(filtersData.endDate);
    }
    andConditions.push({
      createdAt: dateFilter,
    });
  }

  const sortConditions: { [key: string]: SortOrder } = {};
  if (sortBy && sortOrder) {
    sortConditions[sortBy] = sortOrder;
  }

  const whereConditions =
    andConditions.length > 0 ? { $and: andConditions } : {};

  const result = await Payment.find(whereConditions)
    .populate('order')
    .populate('user')
    .sort(sortConditions)
    .skip(skip)
    .limit(limit);

  const total = await Payment.countDocuments(whereConditions);

  return {
    meta: {
      page,
      limit,
      total,
    },
    data: result,
  };
};

const getUserPayments = async (userId: string): Promise<IPayment[]> => {
  const user = await User.findOne({ id: userId });
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }

  const payments = await Payment.find({ user: user._id })
    .populate('order')
    .sort({ createdAt: -1 });

  return payments;
};

const refundPayment = async (
  transactionId: string,
  refundAmount: number,
  refundReason: string,
): Promise<IPayment | null> => {
  const session = await mongoose.startSession();
  let refundedPayment = null;

  try {
    session.startTransaction();

    const payment = await Payment.findOne({ transactionId }).session(session);
    if (!payment) {
      throw new ApiError(httpStatus.NOT_FOUND, 'Payment not found');
    }

    if (payment.status !== 'completed') {
      throw new ApiError(
        httpStatus.BAD_REQUEST,
        'Only completed payments can be refunded',
      );
    }

    if (refundAmount > payment.amount) {
      throw new ApiError(
        httpStatus.BAD_REQUEST,
        'Refund amount cannot exceed payment amount',
      );
    }

    // Update payment status and refund details
    payment.status = 'refunded';
    payment.refundAmount = refundAmount;
    payment.refundDate = new Date();
    payment.refundReason = refundReason;
    await payment.save({ session });

    // Update order status
    const order = await Order.findById(payment.order).session(session);
    if (order) {
      order.paymentStatus = 'refunded';
      await order.save({ session });
    }

    refundedPayment = payment;

    await session.commitTransaction();
    await session.endSession();
  } catch (error) {
    await session.abortTransaction();
    await session.endSession();
    throw error;
  }

  return refundedPayment;
};

const validateSSLCommerzIPN = async (): Promise<boolean> => {
  // Implement SSLCommerz IPN validation
  // This should verify the IPN request is genuine
  // You'll need to implement the validation logic based on SSLCommerz documentation

  // For now, return true (in production, implement proper validation)
  return true;
};

export const PaymentServices = {
  initPayment,
  handleIPN,
  getPayment,
  getAllPayments,
  getUserPayments,
  refundPayment,
  validateSSLCommerzIPN,
};
