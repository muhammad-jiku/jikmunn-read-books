import { Model, Types } from 'mongoose';

export type IEBookAccess = {
  user: Types.ObjectId;
  book: Types.ObjectId;
  order: Types.ObjectId;
  accessToken: string;
  expiresAt: Date;
  downloadCount: number;
  lastAccessed?: Date;
  isActive: boolean;
};

export type IEBookAccessModel = Model<IEBookAccess, Record<string, unknown>>;
