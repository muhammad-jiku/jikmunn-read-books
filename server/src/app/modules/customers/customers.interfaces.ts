import { Model, Schema } from 'mongoose';
import { ICustomerBookList } from '../customerBookLists/customerBookLists.interfaces';
import { ICustomerBookWishlist } from '../customerBookWishlists/customerBookWishlists.interfaces';

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
  wishlist?: Schema.Types.ObjectId | ICustomerBookWishlist; // Books wishlist references
  books?: Schema.Types.ObjectId | ICustomerBookList; // Reading, Plan to read, Finished books
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
