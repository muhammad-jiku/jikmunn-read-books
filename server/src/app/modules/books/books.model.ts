import { model, Schema } from 'mongoose';
import { IBook, IBookModel } from './books.interfaces';

const bookSchema = new Schema<IBook, IBookModel>(
  {
    title: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    subtitle: {
      type: String,
      required: false,
      trim: true,
    },
    author: {
      type: Schema.Types.ObjectId,
      ref: 'Author',
      required: true,
    },
    publicationDate: {
      type: String,
      required: true,
    },
    publisher: {
      type: String,
      required: true,
      trim: true,
    },
    pages: {
      type: Number,
      required: true,
      min: 1,
    },
    genre: {
      type: String,
      required: true,
      trim: true,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    website: {
      type: String,
      required: false,
    },
    reviews: [
      {
        type: String,
      },
    ],
    image: {
      type: String,
      required: false,
    },
    // New e-commerce fields
    isbn: {
      type: String,
      unique: true,
      sparse: true,
      trim: true,
    },
    stock: {
      type: Number,
      required: true,
      default: 0,
      min: 0,
    },
    isAvailable: {
      type: Boolean,
      default: true,
    },
    ebookUrl: {
      type: String,
      required: false,
    },
    categories: [
      {
        type: String,
        required: true,
        trim: true,
      },
    ],
    tags: [
      {
        type: String,
        trim: true,
      },
    ],
    averageRating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },
    totalReviews: {
      type: Number,
      default: 0,
      min: 0,
    },
    discount: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },
    originalPrice: {
      type: Number,
      min: 0,
    },
    isFeatured: {
      type: Boolean,
      default: false,
    },
    language: {
      type: String,
      required: true,
      default: 'English',
    },
    edition: {
      type: String,
      trim: true,
    },
    weight: {
      type: Number,
      min: 0,
    },
    dimensions: {
      length: {
        type: Number,
        min: 0,
      },
      width: {
        type: Number,
        min: 0,
      },
      height: {
        type: Number,
        min: 0,
      },
    },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
    },
  },
);

// Virtual for discounted price
bookSchema.virtual('discountedPrice').get(function () {
  if (this.discount && this.discount > 0) {
    return this.price * (1 - this.discount / 100);
  }
  return this.price;
});

// Index for better search performance
bookSchema.index({ title: 'text', description: 'text', author: 1 });
bookSchema.index({ categories: 1 });
bookSchema.index({ price: 1 });
bookSchema.index({ averageRating: -1 });
bookSchema.index({ createdAt: -1 });

export const Book = model<IBook, IBookModel>('Book', bookSchema);
