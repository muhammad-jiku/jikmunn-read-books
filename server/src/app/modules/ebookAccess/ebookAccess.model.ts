import { model, Schema } from 'mongoose';
import { IEBookAccess, IEBookAccessModel } from './ebookAccess.interfaces';

const ebookAccessSchema = new Schema<IEBookAccess, IEBookAccessModel>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    book: {
      type: Schema.Types.ObjectId,
      ref: 'Book',
      required: true,
    },
    order: {
      type: Schema.Types.ObjectId,
      ref: 'Order',
      required: true,
    },
    accessToken: {
      type: String,
      required: true,
      unique: true,
    },
    expiresAt: {
      type: Date,
      required: true,
    },
    downloadCount: {
      type: Number,
      default: 0,
    },
    lastAccessed: {
      type: Date,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
    },
  },
);

// Compound index
ebookAccessSchema.index({ user: 1, book: 1 });
ebookAccessSchema.index({ accessToken: 1 });
ebookAccessSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 }); // TTL index

export const EBookAccess = model<IEBookAccess, IEBookAccessModel>(
  'EBookAccess',
  ebookAccessSchema,
);
