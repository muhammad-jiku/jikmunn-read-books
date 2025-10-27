import crypto from 'crypto';
import httpStatus from 'http-status';
import ApiError from '../../../errors/ApiError';
import { Order } from '../orders/orders.model';
import { IEBookAccess } from './ebookAccess.interfaces';
import { EBookAccess } from './ebookAccess.model';

const grantEBookAccess = async (orderId: string): Promise<IEBookAccess[]> => {
  const order = await Order.findById(orderId).populate('items.book');

  if (!order) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Order not found');
  }

  if (order.paymentStatus !== 'completed') {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Order payment not completed');
  }

  const ebookAccesses: IEBookAccess[] = [];

  for (const item of order.items) {
    if (item.ebookAccess) {
      // Check if access already exists
      const existingAccess = await EBookAccess.findOne({
        user: order.user,
        book: item.book,
        order: order._id,
      });

      if (!existingAccess) {
        // Generate access token
        const accessToken = crypto.randomBytes(32).toString('hex');
        const expiresAt = new Date();
        expiresAt.setFullYear(expiresAt.getFullYear() + 1); // 1 year access

        const ebookAccess: IEBookAccess = {
          user: order.user,
          book: item.book._id,
          order: order._id,
          accessToken,
          expiresAt,
          downloadCount: 0,
          isActive: true,
        };

        const newAccess = await EBookAccess.create(ebookAccess);
        ebookAccesses.push(newAccess);
      }
    }
  }

  return ebookAccesses;
};

const getEBookAccess = async (
  accessToken: string,
): Promise<IEBookAccess | null> => {
  const ebookAccess = await EBookAccess.findOne({ accessToken })
    .populate('user')
    .populate('book')
    .populate('order');

  if (!ebookAccess) {
    throw new ApiError(httpStatus.NOT_FOUND, 'E-book access not found');
  }

  if (!ebookAccess.isActive) {
    throw new ApiError(httpStatus.FORBIDDEN, 'E-book access is inactive');
  }

  if (ebookAccess.expiresAt < new Date()) {
    throw new ApiError(httpStatus.FORBIDDEN, 'E-book access has expired');
  }

  // Update last accessed and download count
  ebookAccess.lastAccessed = new Date();
  ebookAccess.downloadCount += 1;
  await ebookAccess.save();

  return ebookAccess;
};

const getUserEBooks = async (userId: string): Promise<IEBookAccess[]> => {
  const ebookAccesses = await EBookAccess.find({ user: userId })
    .populate('book')
    .populate('order')
    .sort({ createdAt: -1 });

  return ebookAccesses;
};

const revokeEBookAccess = async (
  accessToken: string,
): Promise<IEBookAccess | null> => {
  const ebookAccess = await EBookAccess.findOne({ accessToken });

  if (!ebookAccess) {
    throw new ApiError(httpStatus.NOT_FOUND, 'E-book access not found');
  }

  ebookAccess.isActive = false;
  await ebookAccess.save();

  return ebookAccess;
};

export const EBookAccessServices = {
  grantEBookAccess,
  getEBookAccess,
  getUserEBooks,
  revokeEBookAccess,
};
