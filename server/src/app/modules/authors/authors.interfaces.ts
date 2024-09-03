import { Model, Schema } from 'mongoose';

interface UserName {
  firstName: string;
  middleName: string;
  lastName: string;
}

export interface IAuthor {
  id: string;
  name: UserName; //embedded object
  gender: 'male' | 'female';
  dateOfBirth: string;
  email: string;
  contactNo: string;
  presentAddress: string;
  permanentAddress: string;
  manageBooks?: Schema.Types.ObjectId[]; // Array of book references
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
