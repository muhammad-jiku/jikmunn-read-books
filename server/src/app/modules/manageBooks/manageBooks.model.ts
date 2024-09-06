import { model, Schema } from 'mongoose';
import { IManageBook, IManageBookModel } from './manageBooks.interfaces';

const manageBookSchema = new Schema<IManageBook, IManageBookModel>(
  {
    author: {
      type: Schema.Types.ObjectId,
      ref: 'Author',
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

export const ManageBook = model<IManageBook, IManageBookModel>(
  'ManageBook',
  manageBookSchema,
);
