/* eslint-disable @typescript-eslint/no-explicit-any */
import httpStatus from 'http-status';
import mongoose, { SortOrder } from 'mongoose';
import ApiError from '../../../errors/ApiError';
import { paginationHelpers } from '../../../helpers/paginationHelpers';
import { IGenericResponse } from '../../../interfaces/common';
import { IPaginationOptions } from '../../../interfaces/pagination';
import { User } from '../users/users.model';
import { adminSearchableFields } from './admins.constants';
import { IAdmin, IAdminFilters } from './admins.interfaces';
import { Admin } from './admins.model';

const getAllAdmins = async (
  filters: IAdminFilters,
  paginationOptions: IPaginationOptions,
): Promise<IGenericResponse<IAdmin[]>> => {
  // Extract searchTerm to implement search query
  const { searchTerm, ...filtersData } = filters;
  const { page, limit, skip, sortBy, sortOrder } =
    paginationHelpers.calculatePagination(paginationOptions);

  const andConditions = [];
  // Search needs $or for searching in specified fields
  if (searchTerm) {
    andConditions.push({
      $or: adminSearchableFields.map(field => ({
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

  const result = await Admin.find(whereConditions)
    .sort(sortConditions)
    .skip(skip)
    .limit(limit);

  const total = await Admin.countDocuments(whereConditions);

  return {
    meta: {
      page,
      limit,
      total,
    },
    data: result,
  };
};

const getAdmin = async (id: string): Promise<IAdmin | null> => {
  const result = await Admin.findOne({ id });

  return result;
};

const updateAdmin = async (
  id: string,
  payload: Partial<IAdmin>,
): Promise<IAdmin | null> => {
  // Check if the admin exists
  const existingAdmin = await Admin.findOne({ id });
  if (!existingAdmin) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Admin information not found!');
  }

  const { name, ...adminData } = payload;

  // Prepare conditions for checking unique fields
  const uniqueConditions = [];
  if (adminData.id) {
    uniqueConditions.push({ id: adminData.id });
  }
  if (adminData.email) {
    uniqueConditions.push({ email: adminData.email });
  }
  if (adminData.contactNo) {
    uniqueConditions.push({ contactNo: adminData.contactNo });
  }

  // Check for uniqueness of fields
  if (uniqueConditions.length > 0) {
    const isDuplicate = await Admin.findOne({ $or: uniqueConditions });
    if (isDuplicate) {
      throw new ApiError(
        httpStatus.BAD_REQUEST,
        'Please check the data, it seems like value of the fields that you provided are already exists!',
      );
    }
  }

  // Prepare update data
  const updatedAdminData: Partial<IAdmin> = { ...adminData };

  if (name && Object.keys(name).length > 0) {
    Object.keys(name).forEach(key => {
      const nameKey = `name.${key}` as keyof Partial<IAdmin>;
      (updatedAdminData as any)[nameKey] = name[key as keyof typeof name];
    });
  }

  // Update and return the admin document
  const result = await Admin.findOneAndUpdate({ id }, updatedAdminData, {
    new: true,
  });

  return result;
};

const deleteAdmin = async (id: string): Promise<IAdmin | null> => {
  // check if the admin is exist
  const isExist = await Admin.findOne({ id });

  if (!isExist) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Admin not found !');
  }

  const session = await mongoose.startSession();

  try {
    session.startTransaction();

    // delete admin first
    const admin = await Admin.findOneAndDelete({ id }, { session });
    if (!admin) {
      throw new ApiError(404, 'Failed to delete admin');
    }

    // delete user
    await User.deleteOne({ id });
    await session.commitTransaction();
    await session.endSession();

    return admin;
  } catch (error) {
    await session.abortTransaction();
    throw error;
  }
};

export const AdminServices = {
  getAllAdmins,
  getAdmin,
  updateAdmin,
  deleteAdmin,
};
