import { model, Schema } from 'mongoose';
import { IBook, IBookModel } from './books.interfaces';

const bookSchema = new Schema<IBook, IBookModel>(
  {
    id: {
      type: String,
      required: true,
      unique: true,
    },
    title: {
      type: String,
      required: true,
      unique: true,
    },
    subtitle: {
      type: String,
      required: false,
    },
    author: {
      type: Schema.Types.ObjectId,
      ref: 'Author',
      required: true,
    },
    publicationDate: {
      type: Date,
      required: true,
    },
    publisher: {
      type: String,

      required: true,
    },
    pages: {
      type: Number,
      required: true,
    },
    genre: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    website: {
      type: String,
      required: false,
    },
    reviews: [
      {
        type: String,
        required: true,
      },
    ],
    image: {
      type: String,
      required: false,
    },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
    },
  },
);

export const Book = model<IBook, IBookModel>('Book', bookSchema);
