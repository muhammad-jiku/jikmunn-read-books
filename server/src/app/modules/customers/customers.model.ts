import { model, Schema } from 'mongoose';
import { gender } from './customers.constants';
import { ICustomer, ICustomerModel } from './customers.interfaces';

const customerSchema = new Schema<ICustomer, ICustomerModel>(
  {
    id: {
      type: String,
      required: true,
      unique: true,
    },
    name: {
      type: {
        firstName: {
          type: String,
          required: true,
        },
        middleName: {
          type: String,
          required: false,
        },
        lastName: {
          type: String,
          required: true,
        },
      },
      required: true,
    },
    gender: {
      type: String,
      enum: gender,
    },
    dateOfBirth: {
      type: String,
    },
    email: {
      type: String,
      unique: true,
      required: true,
    },
    contactNo: {
      type: String,
      unique: true,
      required: true,
    },
    presentAddress: {
      type: String,
      required: true,
    },
    permanentAddress: {
      type: String,
      required: true,
    },
    wishlist: {
      type: Schema.Types.ObjectId,
      ref: 'CustomerBookWishlist',
    },
    books: {
      type: Schema.Types.ObjectId,
      ref: 'CustomerBookList',
    },
    profileImage: {
      type: String,
    },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
    },
  },
);

export const Customer: ICustomerModel = model<ICustomer, ICustomerModel>(
  'Customer',
  customerSchema,
);
