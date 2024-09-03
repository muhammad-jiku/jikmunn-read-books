import bcrypt from 'bcrypt';
import { model, Schema } from 'mongoose';
import config from '../../../config';
import { IUser, IUserModel } from './users.interfaces';

// schema pattern for statics methods
const userSchema = new Schema<IUser, IUserModel>(
  {
    id: {
      type: String,
      required: true,
      unique: true,
    },
    role: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
      select: 0,
    },
    needsPasswordChange: {
      type: Boolean,
      default: true,
    },
    passwordChangedAt: {
      type: Date,
    },
    customer: {
      type: Schema.Types.ObjectId,
      ref: 'Customer',
    },
    author: {
      type: Schema.Types.ObjectId,
      ref: 'Author',
    },
    admin: {
      type: Schema.Types.ObjectId,
      ref: 'Admin',
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
  },
);

// statics methods for checking user existence
userSchema.statics.isUserExist = async function (
  id: string,
): Promise<Pick<
  IUser,
  'id' | 'role' | 'password' | 'needsPasswordChange'
> | null> {
  const user = await User.findOne(
    { id },
    { id: 1, role: 1, password: 1, needsPasswordChange: 1 },
  );

  return user;
};

// statics methods for checking password matches
userSchema.statics.isPasswordMatch = async function (
  givenPassword: string,
  savedPassword: string,
): Promise<boolean> {
  const isMatched = await bcrypt.compare(givenPassword, savedPassword);

  return isMatched;
};

// hashing password during user creation // the method is either user.save() or user.create()
userSchema.pre('save', async function (next) {
  // hash user password
  const user = this;
  user.password = await bcrypt.hash(
    user.password,
    Number(config.bcrypt_salt_rounds),
  );

  if (!user.needsPasswordChange) {
    user.passwordChangedAt = new Date();
  }

  next();
});

export const User: IUserModel = model<IUser, IUserModel>('User', userSchema);
