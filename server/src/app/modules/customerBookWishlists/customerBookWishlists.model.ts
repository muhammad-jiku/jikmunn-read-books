import { model, Schema } from 'mongoose';
import {
  ICustomerBookWishlist,
  ICustomerBookWishlistModel,
} from './customerBookWishlists.interfaces';

const customerBookWishlistSchema = new Schema<
  ICustomerBookWishlist,
  ICustomerBookWishlistModel
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

export const CustomerBookWishlist = model<
  ICustomerBookWishlist,
  ICustomerBookWishlistModel
>('CustomerBookWishlist', customerBookWishlistSchema);
