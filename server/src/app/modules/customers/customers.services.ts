/* eslint-disable @typescript-eslint/no-explicit-any */
import httpStatus from 'http-status';
import mongoose, { SortOrder } from 'mongoose';
import ApiError from '../../../errors/ApiError';
import { paginationHelpers } from '../../../helpers/paginationHelpers';
import { IGenericResponse } from '../../../interfaces/common';
import { IPaginationOptions } from '../../../interfaces/pagination';
import { CustomerBookList } from '../customerBookLists/customerBookLists.model';
import { CustomerBookWishlist } from '../customerBookWishlists/customerBookWishlists.model';
import { User } from '../users/users.model';
import { customerSearchableFields } from './customers.constants';
import { ICustomer, ICustomerFilters } from './customers.interfaces';
import { Customer } from './customers.model';

const getAllCustomers = async (
  filters: ICustomerFilters,
  paginationOptions: IPaginationOptions,
): Promise<IGenericResponse<ICustomer[]>> => {
  // Extract searchTerm to implement search query
  const { searchTerm, ...filtersData } = filters;
  const { page, limit, skip, sortBy, sortOrder } =
    paginationHelpers.calculatePagination(paginationOptions);

  const andConditions = [];
  // Search needs $or for searching in specified fields
  if (searchTerm) {
    andConditions.push({
      $or: customerSearchableFields.map(field => ({
        [field]: {
          $regex: searchTerm,
          $options: 'i',
        },
      })),
    });
  }

  // Filters needs $and to fullfill all the conditions
  if (Object.keys(filtersData).length) {
    andConditions.push({
      $and: Object.entries(filtersData).map(([field, value]) => ({
        [field]: value,
      })),
    });
  }

  // Dynamic  Sort needs  field to  do sorting
  const sortConditions: { [key: string]: SortOrder } = {};
  if (sortBy && sortOrder) {
    sortConditions[sortBy] = sortOrder;
  }
  const whereConditions =
    andConditions.length > 0 ? { $and: andConditions } : {};

  const result = await Customer.find(whereConditions)
    .populate('wishlist')
    .populate('books')
    .sort(sortConditions)
    .skip(skip)
    .limit(limit);

  const total = await Customer.countDocuments(whereConditions);

  return {
    meta: {
      page,
      limit,
      total,
    },
    data: result,
  };
};

const getCustomer = async (id: string): Promise<ICustomer | null> => {
  const result = await Customer.findOne({ id })
    .populate('wishlist')
    .populate('books');

  return result;
};

const updateCustomer = async (
  id: string,
  payload: Partial<ICustomer>,
): Promise<ICustomer | null> => {
  // Check if the customer exists
  const existingCustomer = await Customer.findOne({ id });
  if (!existingCustomer) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Customer information not found!');
  }

  const { name, ...customerData } = payload;

  // Prepare conditions for checking unique fields
  const uniqueConditions = [];
  if (customerData.id) {
    uniqueConditions.push({ id: customerData.id });
  }
  if (customerData.email) {
    uniqueConditions.push({ email: customerData.email });
  }
  if (customerData.contactNo) {
    uniqueConditions.push({ contactNo: customerData.contactNo });
  }

  // Check for uniqueness of fields
  if (uniqueConditions.length > 0) {
    const isDuplicate = await Customer.findOne({ $or: uniqueConditions });
    if (isDuplicate) {
      throw new ApiError(
        httpStatus.BAD_REQUEST,
        'Please check the data, it seems like value of the fields that you provided are already exists!',
      );
    }
  }

  // Prepare update data
  const updatedCustomerData: Partial<ICustomer> = { ...customerData };

  if (name && Object.keys(name).length > 0) {
    Object.keys(name).forEach(key => {
      const nameKey = `name.${key}` as keyof Partial<ICustomer>;
      (updatedCustomerData as any)[nameKey] = name[key as keyof typeof name];
    });
  }

  // Update and return the customer document
  const result = await Customer.findOneAndUpdate({ id }, updatedCustomerData, {
    new: true,
  })
    .populate('wishlist')
    .populate('books');

  return result;
};

const deleteCustomer = async (id: string): Promise<ICustomer | null> => {
  // check if the customer is exist
  const isCustomerExist = await Customer.findOne({ id });

  if (!isCustomerExist) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Customer not found !');
  }

  const session = await mongoose.startSession();

  try {
    session.startTransaction();

    // delete customer list first if it exists
    await CustomerBookList.findOneAndDelete(
      { customer: isCustomerExist._id },
      { session },
    );

    // then delete customer wishlist if it exists
    await CustomerBookWishlist.findOneAndDelete(
      { customer: isCustomerExist._id },
      { session },
    );

    // then delete customer itself
    const customer = await Customer.findOneAndDelete({ id }, { session });
    if (!customer) {
      throw new ApiError(httpStatus.NOT_FOUND, 'Failed to delete customer');
    }

    // and finally delete user
    await User.deleteOne({ id });
    await session.commitTransaction();
    await session.endSession();

    return customer;
  } catch (error) {
    await session.abortTransaction();
    throw error;
  }
};

export const CustomerServices = {
  getAllCustomers,
  getCustomer,
  updateCustomer,
  deleteCustomer,
};
