import { model, Schema } from 'mongoose';
import {
  ICustomerWishlists,
  ICustomerWishlistsModel,
} from './customersWishlists.interfaces';

const customersWishlistsSchema = new Schema<
  ICustomerWishlists,
  ICustomerWishlistsModel
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

export const CustomersWishlist = model<
  ICustomerWishlists,
  ICustomerWishlistsModel
>('CustomersWishlist', customersWishlistsSchema);
