/* eslint-disable @typescript-eslint/no-explicit-any */
import httpStatus from 'http-status';
import mongoose, { SortOrder } from 'mongoose';
import ApiError from '../../../errors/ApiError';
import { paginationHelpers } from '../../../helpers/paginationHelpers';
import { IGenericResponse } from '../../../interfaces/common';
import { IPaginationOptions } from '../../../interfaces/pagination';
import { Book } from '../books/books.model';
import { InvoiceServices } from '../invoices/invoices.services';
import { User } from '../users/users.model';
import { orderSearchableFields } from './orders.constants';
import { IOrder, IOrderFilters } from './orders.interfaces';
import { Order } from './orders.model';

const createOrder = async (orderData: IOrder): Promise<IOrder | null> => {
  const session = await mongoose.startSession();
  let newOrder = null;

  try {
    session.startTransaction();

    // Validate books and check stock
    for (const item of orderData.items) {
      const book = await Book.findById(item.book).session(session);
      if (!book) {
        throw new ApiError(
          httpStatus.NOT_FOUND,
          `Book not found: ${item.book}`,
        );
      }
      if (!book.isAvailable) {
        throw new ApiError(
          httpStatus.BAD_REQUEST,
          `Book is not available: ${book.title}`,
        );
      }
      if (book.stock < item.quantity) {
        throw new ApiError(
          httpStatus.BAD_REQUEST,
          `Insufficient stock for: ${book.title}. Available: ${book.stock}, Requested: ${item.quantity}`,
        );
      }

      // Update book stock
      book.stock -= item.quantity;
      if (book.stock === 0) {
        book.isAvailable = false;
      }
      await book.save({ session });
    }

    // Generate transaction ID
    const tran_id = `TXN${Date.now()}${Math.random().toString(36).substr(2, 9)}`;
    orderData.tran_id = tran_id;

    // Create order
    const order = await Order.create([orderData], { session });
    if (!order.length) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'Failed to create order');
    }

    newOrder = order[0];

    // Create invoice for the order
    if (newOrder) {
      await InvoiceServices.createInvoiceFromOrder(newOrder._id.toString());
    }

    await session.commitTransaction();
    await session.endSession();
  } catch (error) {
    await session.abortTransaction();
    await session.endSession();
    throw error;
  }

  // Populate order data
  if (newOrder) {
    newOrder = await Order.findById(newOrder._id)
      .populate('user')
      .populate('items.book');
  }

  return newOrder;
};

const getAllOrders = async (
  filters: IOrderFilters,
  paginationOptions: IPaginationOptions,
): Promise<IGenericResponse<IOrder[]>> => {
  const { searchTerm, ...filtersData } = filters;
  const { page, limit, skip, sortBy, sortOrder } =
    paginationHelpers.calculatePagination(paginationOptions);

  const andConditions = [];

  if (searchTerm) {
    andConditions.push({
      $or: orderSearchableFields.map(field => ({
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

  // Amount range filter
  if (filtersData.minAmount || filtersData.maxAmount) {
    const amountFilter: any = {};
    if (filtersData.minAmount) {
      amountFilter.$gte = Number(filtersData.minAmount);
    }
    if (filtersData.maxAmount) {
      amountFilter.$lte = Number(filtersData.maxAmount);
    }
    andConditions.push({
      totalAmount: amountFilter,
    });
  }

  const sortConditions: { [key: string]: SortOrder } = {};
  if (sortBy && sortOrder) {
    sortConditions[sortBy] = sortOrder;
  }

  const whereConditions =
    andConditions.length > 0 ? { $and: andConditions } : {};

  const result = await Order.find(whereConditions)
    .populate('user')
    .populate('items.book')
    .sort(sortConditions)
    .skip(skip)
    .limit(limit);

  const total = await Order.countDocuments(whereConditions);

  return {
    meta: {
      page,
      limit,
      total,
    },
    data: result,
  };
};

const getOrder = async (id: string): Promise<IOrder | null> => {
  const result = await Order.findById(id)
    .populate('user')
    .populate('items.book');

  if (!result) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Order not found');
  }

  return result;
};

const getUserOrders = async (userId: string): Promise<IOrder[]> => {
  const user = await User.findOne({ id: userId });
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }

  const result = await Order.find({ user: user._id })
    .populate('items.book')
    .sort({ createdAt: -1 });

  return result;
};

const updateOrder = async (
  id: string,
  payload: Partial<IOrder>,
): Promise<IOrder | null> => {
  const session = await mongoose.startSession();
  let updatedOrder = null;

  try {
    session.startTransaction();

    const order = await Order.findById(id).session(session);
    if (!order) {
      throw new ApiError(httpStatus.NOT_FOUND, 'Order not found');
    }

    // Handle stock management if delivery status changes to cancelled
    if (
      payload.deliveryStatus === 'cancelled' &&
      order.deliveryStatus !== 'cancelled'
    ) {
      for (const item of order.items) {
        const book = await Book.findById(item.book).session(session);
        if (book) {
          book.stock += item.quantity;
          book.isAvailable = true;
          await book.save({ session });
        }
      }
      payload.cancelledAt = new Date();
    }

    // Handle delivery completion
    if (
      payload.deliveryStatus === 'delivered' &&
      order.deliveryStatus !== 'delivered'
    ) {
      payload.deliveredAt = new Date();
    }

    updatedOrder = await Order.findByIdAndUpdate(id, payload, {
      new: true,
      session,
    })
      .populate('user')
      .populate('items.book');

    await session.commitTransaction();
    await session.endSession();
  } catch (error) {
    await session.abortTransaction();
    await session.endSession();
    throw error;
  }

  return updatedOrder;
};

const deleteOrder = async (id: string): Promise<IOrder | null> => {
  const session = await mongoose.startSession();
  let deletedOrder = null;

  try {
    session.startTransaction();

    const order = await Order.findById(id).session(session);
    if (!order) {
      throw new ApiError(httpStatus.NOT_FOUND, 'Order not found');
    }

    // Restore book stock
    for (const item of order.items) {
      const book = await Book.findById(item.book).session(session);
      if (book) {
        book.stock += item.quantity;
        book.isAvailable = true;
        await book.save({ session });
      }
    }

    deletedOrder = await Order.findByIdAndDelete(id, { session });

    await session.commitTransaction();
    await session.endSession();
  } catch (error) {
    await session.abortTransaction();
    await session.endSession();
    throw error;
  }

  return deletedOrder;
};

export const OrderServices = {
  createOrder,
  getAllOrders,
  getOrder,
  getUserOrders,
  updateOrder,
  deleteOrder,
};
