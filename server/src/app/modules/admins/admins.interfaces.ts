import { Model } from 'mongoose';

interface UserName {
  firstName: string;
  middleName: string;
  lastName: string;
}

export interface IAdmin {
  id: string;
  name: UserName; //embedded object
  gender: 'male' | 'female';
  dateOfBirth: string;
  email: string;
  contactNo: string;
  presentAddress: string;
  permanentAddress: string;
  profileImage?: string;
}

export type IAdminModel = Model<IAdmin, Record<string, unknown>>;

export interface IAdminFilters {
  searchTerm?: string;
  id?: string;
  email?: string;
  contactNo?: string;
  presentAddress?: string;
}
