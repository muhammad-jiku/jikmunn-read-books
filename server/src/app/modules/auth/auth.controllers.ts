import { NextFunction, Request, Response } from 'express';
import httpStatus from 'http-status';
import config from '../../../config';
import { catchAsync } from '../../../shared/catchAsync';
import { sendResponse } from '../../../shared/sendResponse';
import { ILoginUserResponse, IRefreshTokenResponse } from './auth.interfaces';
import { AuthServices } from './auth.services';

const loginUser = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { ...logInData } = await req.body;

      const result = await AuthServices.loginUser(logInData);
      const { refreshToken, ...othersData } = result;

      // set refresh token into the cookie
      const cookieOptions = {
        secure: config.env === 'production' ? true : false,
        httpOnly: true,
      };

      res.cookie('refreshToken', refreshToken, cookieOptions);

      sendResponse<ILoginUserResponse>(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Login successful',
        data: othersData,
      });
    } catch (error) {
      return next(error);
    }
  },
);

const refreshTokenHandler = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { refreshToken } = req.cookies;

      const result = await AuthServices.refreshTokenHandler(refreshToken);

      // set refresh token into the cookie
      const cookieOptions = {
        secure: config.env === 'production' ? true : false,
        httpOnly: true,
      };

      res.cookie('refreshToken', refreshToken, cookieOptions);

      sendResponse<IRefreshTokenResponse>(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'User refesh token updated successfully',
        data: result,
      });
    } catch (error) {
      return next(error);
    }
  },
);

const changePassword = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const user = req.user;
      const { ...passwordsData } = await req.body;

      await AuthServices.changePassword(user, passwordsData);

      sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Password changed successfully!',
      });
    } catch (error) {
      return next(error);
    }
  },
);

export const AuthControllers = {
  loginUser,
  refreshTokenHandler,
  changePassword,
};
