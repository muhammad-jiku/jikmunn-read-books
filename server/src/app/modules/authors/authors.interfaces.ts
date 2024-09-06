import { Model, Schema } from 'mongoose';
import { IManageBook } from '../manageBooks/manageBooks.interfaces';

interface UserName {
  firstName: string;
  middleName: string;
  lastName: string;
}

export interface IAuthor {
  id: string;
  name: UserName; //embedded object
  gender: 'male' | 'female';
  dateOfBirth: Date;
  email: string;
  contactNo: string;
  presentAddress: string;
  permanentAddress: string;
  manageBook?: Schema.Types.ObjectId | IManageBook; // manage books references
  profileImage?: string;
}

export type IAuthorModel = Model<IAuthor, Record<string, unknown>>;

export interface IAuthorFilters {
  searchTerm?: string;
  id?: string;
  email?: string;
  contactNo?: string;
  presentAddress?: string;
}
