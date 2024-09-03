import { Model, Schema } from 'mongoose';

interface UserName {
  firstName: string;
  middleName?: string;
  lastName: string;
}

interface Reading {
  book: Schema.Types.ObjectId;
  status: 'reading';
}

interface PlanToRead {
  book: Schema.Types.ObjectId;
  status: 'plan to read';
}

interface Finished {
  book: Schema.Types.ObjectId;
  status: 'finished';
}

export interface ICustomer {
  id: string;
  name: UserName; //embedded object
  gender: 'male' | 'female';
  dateOfBirth: string;
  email: string;
  contactNo: string;
  presentAddress: string;
  permanentAddress: string;
  wishlist?: Schema.Types.ObjectId[]; // Array of book references
  currentlyReading?: Reading[]; // Books currently being read
  planToRead?: PlanToRead[]; // Books planned to be read
  finishedReading?: Finished[]; // Finished books
  profileImage?: string;
}

export type ICustomerModel = Model<ICustomer, Record<string, unknown>>;

export interface ICustomerFilters {
  searchTerm?: string;
  id?: string;
  email?: string;
  contactNo?: string;
  presentAddress?: string;
}
