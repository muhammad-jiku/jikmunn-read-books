/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { NextFunction, Request, Response } from 'express';
import httpStatus from 'http-status';
import { Secret } from 'jsonwebtoken';
import config from '../../config';
import ApiError from '../../errors/ApiError';
import { jwtHelpers } from '../../helpers/jwtHelpers';

export const auth =
  (...requiredRoles: string[]) =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      // get authorization token
      const token = req.headers.authorization;
      if (!token) {
        throw new ApiError(
          httpStatus.UNAUTHORIZED,
          'Sorry, you are not authorized to access this route!',
        );
      }

      // verify that token
      let verifiedUserToken = null;
      verifiedUserToken = jwtHelpers.verifyToken(
        token,
        config.jwt.secret as Secret,
      );

      req.user = verifiedUserToken; // userId, role

      // guard against invalid credentials while verifying user token
      if (
        requiredRoles.length &&
        !requiredRoles.includes(verifiedUserToken.role)
      ) {
        throw new ApiError(
          httpStatus.FORBIDDEN,
          'Sorry this route is forbidden!',
        );
      }

      next();
    } catch (error) {
      next(error);
    }
  };
