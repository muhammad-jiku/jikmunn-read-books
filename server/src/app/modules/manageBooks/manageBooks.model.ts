import { model, Schema } from 'mongoose';
import { IManageBooks, IManageBooksModel } from './manageBooks.interfaces';

const manageBooksSchema = new Schema<IManageBooks, IManageBooksModel>(
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

export const ManageBook = model<IManageBooks, IManageBooksModel>(
  'ManageBook',
  manageBooksSchema,
);
