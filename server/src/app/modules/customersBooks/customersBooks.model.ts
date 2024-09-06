import { model, Schema } from 'mongoose';
import { status } from './customersBooks.constants';
import {
  ICustomerBooks,
  ICustomerBooksModel,
} from './customersBooks.interfaces';

const customersBooksSchema = new Schema<ICustomerBooks, ICustomerBooksModel>(
  {
    customer: {
      type: Schema.Types.ObjectId,
      ref: 'Customer',
      required: true,
    },
    books: [
      {
        book: {
          type: Schema.Types.ObjectId,
          ref: 'Book',
          required: true,
        },
        status: {
          type: String,
          required: true,
          enum: status,
        },
        addedAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
    },
  },
);

export const CustomersBooks = model<ICustomerBooks, ICustomerBooksModel>(
  'CustomersBook',
  customersBooksSchema,
);
