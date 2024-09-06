import { Model, Schema } from 'mongoose';
import { IBook } from '../books/books.interfaces';
import { ICustomerWishlists } from '../customersWishlists/customersWishlists.interfaces';

interface UserName {
  firstName: string;
  middleName?: string;
  lastName: string;
}

interface Reading {
  book: Schema.Types.ObjectId | IBook;
  status: 'reading';
}

interface PlanToRead {
  book: Schema.Types.ObjectId | IBook;
  status: 'plan to read';
}

interface Finished {
  book: Schema.Types.ObjectId | IBook;
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
  wishlist?: Schema.Types.ObjectId | ICustomerWishlists; // Books wishlist references
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
