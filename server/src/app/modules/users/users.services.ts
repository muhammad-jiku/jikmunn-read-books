import httpStatus from 'http-status';
import mongoose from 'mongoose';
import config from '../../../config';
import ApiError from '../../../errors/ApiError';
import { IAdmin } from '../admins/admins.interfaces';
import { Admin } from '../admins/admins.model';
import { IAuthor } from '../authors/authors.interfaces';
import { Author } from '../authors/authors.model';
import { ICustomer } from '../customers/customers.interfaces';
import { Customer } from '../customers/customers.model';
import { IUser } from './users.interfaces';
import { User } from './users.model';
import {
  generateAdminId,
  generateAuthorId,
  generateCustomerId,
} from './users.utils';

const createCustomer = async (
  customer: ICustomer,
  user: IUser,
): Promise<IUser | null> => {
  // user password
  if (!user.password) {
    user.password = config.default.customer_pass as string;
  }

  // user role
  user.role = 'customer';

  let newUserAllData = null;
  const session = await mongoose.startSession();
  try {
    session.startTransaction();
    // generate id
    const id = await generateCustomerId();
    user.id = id;
    customer.id = id;

    const newCustomer = await Customer.create([customer], { session });
    if (!newCustomer.length) {
      throw new ApiError(
        httpStatus.BAD_REQUEST,
        'Failed to create student profile!',
      );
    }

    // set student id
    user.customer = newCustomer[0]._id;

    const newUser = await User.create([user], { session });
    if (!newUser.length) {
      throw new ApiError(
        httpStatus.BAD_REQUEST,
        'Failed to create user profile!',
      );
    }
    newUserAllData = newUser[0];

    await session.commitTransaction();
    await session.endSession();
  } catch (error) {
    await session.abortTransaction();
    await session.endSession();
    throw error;
  }

  if (newUserAllData) {
    newUserAllData = await User.findOne({ id: newUserAllData.id }).populate({
      path: 'customer',
    });
  }

  return newUserAllData;
};

const createAuthor = async (
  author: IAuthor,
  user: IUser,
): Promise<IUser | null> => {
  // user password
  if (!user.password) {
    user.password = config.default.author_pass as string;
  }

  // user role
  user.role = 'author';

  let newUserAllData = null;
  const session = await mongoose.startSession();
  try {
    session.startTransaction();
    // generate id
    const id = await generateAuthorId();
    user.id = id;
    author.id = id;

    const newAuthor = await Author.create([author], { session });
    if (!newAuthor.length) {
      throw new ApiError(
        httpStatus.BAD_REQUEST,
        'Failed to create author profile!',
      );
    }

    // set author id
    user.author = newAuthor[0]._id;

    const newUser = await User.create([user], { session });
    if (!newUser.length) {
      throw new ApiError(
        httpStatus.BAD_REQUEST,
        'Failed to create user profile!',
      );
    }
    newUserAllData = newUser[0];

    await session.commitTransaction();
    await session.endSession();
  } catch (error) {
    await session.abortTransaction();
    await session.endSession();
    throw error;
  }

  if (newUserAllData) {
    newUserAllData = await User.findOne({ id: newUserAllData.id }).populate({
      path: 'author',
    });
  }

  return newUserAllData;
};

const createAdmin = async (
  admin: IAdmin,
  user: IUser,
): Promise<IUser | null> => {
  // user password
  if (!user.password) {
    user.password = config.default.admin_pass as string;
  }

  // user role
  user.role = 'admin';

  let newUserAllData = null;
  const session = await mongoose.startSession();
  try {
    session.startTransaction();
    // generate id
    const id = await generateAdminId();
    user.id = id;
    admin.id = id;

    const newAdmin = await Admin.create([admin], { session });
    if (!newAdmin.length) {
      throw new ApiError(
        httpStatus.BAD_REQUEST,
        'Failed to create admin profile!',
      );
    }

    // set admin id
    user.admin = newAdmin[0]._id;

    const newUser = await User.create([user], { session });
    if (!newUser.length) {
      throw new ApiError(
        httpStatus.BAD_REQUEST,
        'Failed to create user profile!',
      );
    }
    newUserAllData = newUser[0];

    await session.commitTransaction();
    await session.endSession();
  } catch (error) {
    await session.abortTransaction();
    await session.endSession();
    throw error;
  }

  if (newUserAllData) {
    newUserAllData = await User.findOne({ id: newUserAllData.id }).populate({
      path: 'admin',
    });
  }

  return newUserAllData;
};

export const UserServices = {
  createCustomer,
  createAuthor,
  createAdmin,
};
