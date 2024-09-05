/* eslint-disable no-unused-vars */
import httpStatus from 'http-status';
import { JwtPayload, Secret } from 'jsonwebtoken';
import config from '../../../config';
import ApiError from '../../../errors/ApiError';
import { jwtHelpers } from '../../../helpers/jwtHelpers';
import { User } from '../users/users.model';
import {
  IChangePassword,
  ILoginUser,
  ILoginUserResponse,
  IRefreshTokenResponse,
} from './auth.interfaces';

const loginUser = async (payload: ILoginUser): Promise<ILoginUserResponse> => {
  const { id, password } = payload;

  const isUserExist = await User.isUserExist(id);
  if (!isUserExist) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User does not exist!');
  }

  if (
    isUserExist.password &&
    !(await User.isPasswordMatch(password, isUserExist?.password as string))
  ) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Password mismatched!');
  }

  const { id: userId, role, needsPasswordChange } = isUserExist;

  // creating access and refresh tokens
  const accessToken = jwtHelpers.createToken(
    { userId, role },
    config.jwt.secret as Secret,
    config.jwt.expires_in as string,
  );

  const refreshToken = jwtHelpers.createToken(
    { userId, role },
    config.jwt.refresh_secret as Secret,
    config.jwt.refresh_expires_in as string,
  );

  return {
    accessToken,
    refreshToken,
    needsPasswordChange,
  };
};

const refreshTokenHandler = async (
  payload: string,
): Promise<IRefreshTokenResponse> => {
  // verify that the refresh token
  let verifiedToken = null;
  try {
    verifiedToken = jwtHelpers.verifyToken(
      payload,
      config.jwt.refresh_secret as Secret,
    );
  } catch (err) {
    throw new ApiError(httpStatus.FORBIDDEN, 'Invalid Refresh Token');
  }

  const { userId, role } = verifiedToken;
  const isUserExist = await User.isUserExist(userId);
  if (!isUserExist) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User does not exist!');
  }

  const newAccesToken = jwtHelpers.createToken(
    { userId, role },
    config.jwt.secret as Secret,
    config.jwt.expires_in as string,
  );

  return {
    accessToken: newAccesToken,
  };
};

const changePassword = async (
  user: JwtPayload | null,
  payload: IChangePassword,
): Promise<void> => {
  const { oldPassword, newPassword } = payload;

  const isUserExist = await User.findOne({ id: user?.userId }).select(
    '+password',
  );
  if (!isUserExist) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User does not exist!');
  }

  // checking old password
  if (
    isUserExist.password &&
    !(await User.isPasswordMatch(oldPassword, isUserExist.password))
  ) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Old Password is incorrect');
  }

  // checking new password
  if (
    isUserExist.password &&
    (await User.isPasswordMatch(newPassword, isUserExist.password))
  ) {
    throw new ApiError(
      httpStatus.UNAUTHORIZED,
      'This password already exists, please try new one!',
    );
  }

  // data update
  isUserExist.password = newPassword;
  isUserExist.needsPasswordChange = false;

  await isUserExist.save();
};

export const AuthServices = {
  loginUser,
  refreshTokenHandler,
  changePassword,
};
