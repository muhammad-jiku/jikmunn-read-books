import httpStatus from 'http-status';
import mongoose, { SortOrder } from 'mongoose';
import ApiError from '../../../errors/ApiError';
import { paginationHelpers } from '../../../helpers/paginationHelpers';
import { IGenericResponse } from '../../../interfaces/common';
import { IPaginationOptions } from '../../../interfaces/pagination';
import { Book } from '../books/books.model';
import { Order } from '../orders/orders.model';
import { User } from '../users/users.model';
import { reviewSearchableFields } from './reviews.constants';
import { IReview, IReviewFilters } from './reviews.interfaces';
import { Review } from './reviews.model';

const createReview = async (reviewData: IReview): Promise<IReview | null> => {
  const session = await mongoose.startSession();
  let newReview = null;

  try {
    session.startTransaction();

    // Check if user already reviewed this book
    const existingReview = await Review.findOne({
      user: reviewData.user,
      book: reviewData.book,
    }).session(session);

    if (existingReview) {
      throw new ApiError(
        httpStatus.BAD_REQUEST,
        'You have already reviewed this book',
      );
    }

    // Check if user purchased the book (for verified purchase)
    if (reviewData.isVerifiedPurchase) {
      const hasPurchased = await Order.findOne({
        user: reviewData.user,
        'items.book': reviewData.book,
        paymentStatus: 'completed',
      }).session(session);

      if (!hasPurchased) {
        throw new ApiError(
          httpStatus.BAD_REQUEST,
          'You must purchase the book to mark as verified purchase',
        );
      }
    }

    // Create review
    const review = await Review.create([reviewData], { session });
    if (!review.length) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'Failed to create review');
    }

    newReview = review[0];

    // Update book's average rating and total reviews
    const book = await Book.findById(reviewData.book).session(session);
    if (book) {
      const reviews = await Review.find({
        book: book._id,
        status: 'approved',
      }).session(session);
      const totalRating =
        reviews.reduce((sum, rev) => sum + rev.rating, 0) + newReview.rating;
      const totalReviews = reviews.length + 1;

      book.averageRating = totalRating / totalReviews;
      book.totalReviews = totalReviews;
      await book.save({ session });
    }

    await session.commitTransaction();
    await session.endSession();
  } catch (error) {
    await session.abortTransaction();
    await session.endSession();
    throw error;
  }

  // Populate review data
  if (newReview) {
    newReview = await Review.findById(newReview._id)
      .populate('user')
      .populate('book');
  }

  return newReview;
};

const getAllReviews = async (
  filters: IReviewFilters,
  paginationOptions: IPaginationOptions,
): Promise<IGenericResponse<IReview[]>> => {
  const { searchTerm, ...filtersData } = filters;
  const { page, limit, skip, sortBy, sortOrder } =
    paginationHelpers.calculatePagination(paginationOptions);

  const andConditions = [];

  if (searchTerm) {
    andConditions.push({
      $or: reviewSearchableFields.map(field => ({
        [field]: {
          $regex: searchTerm,
          $options: 'i',
        },
      })),
    });
  }

  if (Object.keys(filtersData).length) {
    andConditions.push({
      $and: Object.entries(filtersData).map(([field, value]) => ({
        [field]: value,
      })),
    });
  }

  const sortConditions: { [key: string]: SortOrder } = {};
  if (sortBy && sortOrder) {
    sortConditions[sortBy] = sortOrder;
  }

  const whereConditions =
    andConditions.length > 0 ? { $and: andConditions } : {};

  const result = await Review.find(whereConditions)
    .populate('user')
    .populate('book')
    .sort(sortConditions)
    .skip(skip)
    .limit(limit);

  const total = await Review.countDocuments(whereConditions);

  return {
    meta: {
      page,
      limit,
      total,
    },
    data: result,
  };
};

const getReview = async (id: string): Promise<IReview | null> => {
  const result = await Review.findById(id).populate('user').populate('book');

  if (!result) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Review not found');
  }

  return result;
};

const updateReview = async (
  id: string,
  payload: Partial<IReview>,
): Promise<IReview | null> => {
  const session = await mongoose.startSession();
  let updatedReview = null;

  try {
    session.startTransaction();

    const review = await Review.findById(id).session(session);
    if (!review) {
      throw new ApiError(httpStatus.NOT_FOUND, 'Review not found');
    }

    // If rating is being updated, update book's average rating
    if (payload.rating && payload.rating !== review.rating) {
      const book = await Book.findById(review.book).session(session);
      if (book) {
        const reviews = await Review.find({
          book: book._id,
          status: 'approved',
        }).session(session);
        const totalRating = reviews.reduce((sum, rev) => {
          if (rev._id.toString() === id) {
            return sum + payload.rating!;
          }
          return sum + rev.rating;
        }, 0);
        const totalReviews = reviews.length;

        book.averageRating = totalRating / totalReviews;
        await book.save({ session });
      }
    }

    updatedReview = await Review.findByIdAndUpdate(id, payload, {
      new: true,
      session,
    })
      .populate('user')
      .populate('book');

    await session.commitTransaction();
    await session.endSession();
  } catch (error) {
    await session.abortTransaction();
    await session.endSession();
    throw error;
  }

  return updatedReview;
};

const deleteReview = async (id: string): Promise<IReview | null> => {
  const session = await mongoose.startSession();
  let deletedReview = null;

  try {
    session.startTransaction();

    const review = await Review.findById(id).session(session);
    if (!review) {
      throw new ApiError(httpStatus.NOT_FOUND, 'Review not found');
    }

    // Update book's average rating and total reviews
    const book = await Book.findById(review.book).session(session);
    if (book) {
      const reviews = await Review.find({
        book: book._id,
        status: 'approved',
        _id: { $ne: id },
      }).session(session);

      const totalRating = reviews.reduce((sum, rev) => sum + rev.rating, 0);
      const totalReviews = reviews.length;

      book.averageRating = totalReviews > 0 ? totalRating / totalReviews : 0;
      book.totalReviews = totalReviews;
      await book.save({ session });
    }

    deletedReview = await Review.findByIdAndDelete(id, { session });

    await session.commitTransaction();
    await session.endSession();
  } catch (error) {
    await session.abortTransaction();
    await session.endSession();
    throw error;
  }

  return deletedReview;
};

const getReviewsByBook = async (bookId: string): Promise<IReview[]> => {
  const result = await Review.find({ book: bookId, status: 'approved' })
    .populate('user')
    .sort({ helpfulCount: -1, createdAt: -1 });

  return result;
};

const getMyReviews = async (userId: string): Promise<IReview[]> => {
  const user = await User.findOne({ id: userId });
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }

  const result = await Review.find({ user: user._id })
    .populate('book')
    .sort({ createdAt: -1 });

  return result;
};

export const ReviewServices = {
  createReview,
  getAllReviews,
  getReview,
  updateReview,
  deleteReview,
  getReviewsByBook,
  getMyReviews,
};
