import { Model, Types } from 'mongoose';

export interface IUser {
  id: string;
  role: 'customer' | 'author' | 'admin';
  password: string;
  needsPasswordChange: boolean;
  passwordChangedAt?: Date;
  customer?: Types.ObjectId;
  author?: Types.ObjectId;
  admin?: Types.ObjectId;
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
