import { model, Schema } from 'mongoose';
import { status } from './customerBookLists.constants';
import {
  ICustomerBookList,
  ICustomerBookListModel,
} from './customerBookLists.interfaces';

const customerBookListSchema = new Schema<
  ICustomerBookList,
  ICustomerBookListModel
>(
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

export const CustomerBookList = model<
  ICustomerBookList,
  ICustomerBookListModel
>('CustomerBookList', customerBookListSchema);
