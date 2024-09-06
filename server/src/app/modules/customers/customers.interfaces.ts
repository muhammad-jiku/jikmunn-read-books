import { Model, Schema } from 'mongoose';
import { ICustomerBooks } from '../customersBooks/customersBooks.interfaces';
import { ICustomerWishlists } from '../customersWishlists/customersWishlists.interfaces';

interface UserName {
  firstName: string;
  middleName?: string;
  lastName: string;
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
  books?: Schema.Types.ObjectId | ICustomerBooks; // Reading, Plan to read, Finished books
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
