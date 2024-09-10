/* eslint-disable @typescript-eslint/explicit-function-return-type */
// import { NextFunction, Request, RequestHandler, Response } from 'express';

// export const catchAsync = (fn: RequestHandler) => {
//   return async (req: Request, res: Response, next: NextFunction) => {
//     try {
//       fn(req, res, next);
//     } catch (error) {
//       next(error);
//     }
//   };
// };

import { NextFunction, Request, RequestHandler, Response } from 'express';

export const catchAsync = (fn: RequestHandler) => {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};
