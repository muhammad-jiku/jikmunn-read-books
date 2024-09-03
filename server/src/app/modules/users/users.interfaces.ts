/* eslint-disable no-unused-vars */
import { Model, Types } from 'mongoose';
import { IAdmin } from '../admins/admins.interfaces';
import { IAuthor } from '../authors/authors.interfaces';
import { ICustomer } from '../customers/customers.interfaces';

export interface IUser {
  id: string;
  role: 'customer' | 'author' | 'admin';
  password: string;
  needsPasswordChange: boolean;
  passwordChangedAt?: Date;
  customer?: Types.ObjectId | ICustomer;
  author?: Types.ObjectId | IAuthor;
  admin?: Types.ObjectId | IAdmin;
}

// types of user model for statics methods
export type IUserModel = {
  isUserExist(
    id: string,
  ): Promise<Pick<IUser, 'id' | 'role' | 'password' | 'needsPasswordChange'>>;
  isPasswordMatch(
    givenPassword: string,
    savedPassword: string,
  ): Promise<boolean>;
} & Model<IUser>;
