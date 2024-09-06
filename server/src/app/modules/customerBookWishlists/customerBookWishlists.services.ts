/* eslint-disable @typescript-eslint/no-explicit-any */
import httpStatus from 'http-status';
import { JwtPayload } from 'jsonwebtoken';
import mongoose from 'mongoose';
import ApiError from '../../../errors/ApiError';
import { IBook } from '../books/books.interfaces';
import { Book } from '../books/books.model';
import { Customer } from '../customers/customers.model';
import { ICustomerBookWishlist } from './customerBookWishlists.interfaces';
import { CustomerBookWishlist } from './customerBookWishlists.model';

const createCustomerBookWishlist = async (
  user: JwtPayload | null,
  payload: ICustomerBookWishlist,
): Promise<ICustomerBookWishlist | null> => {
  let newWishlistData = null;
  const session = await mongoose.startSession();
  try {
    session.startTransaction();

    // Check if the author exists
    const isCustomerExist = await Customer.findOne({ id: user!.userId });
    if (!isCustomerExist) {
      throw new ApiError(
        httpStatus.NOT_FOUND,
        'Sorry, this customer does not exist!',
      );
    }

    // Iterate over the payload.books to structure the wishlist data
    const wishlistBooks = payload.books.map(book => ({
      book: book.book, // book.book should either be an ObjectId or IBook
      addedAt: book.addedAt || new Date(), // Add current date if not provided
    }));

    const wishlistData = {
      customer: isCustomerExist._id.toString(),
      books: wishlistBooks,
    };

    // Create the new book
    const newWishlist = await CustomerBookWishlist.create([wishlistData], {
      session,
    });

    if (!newWishlist.length) {
      throw new ApiError(
        httpStatus.BAD_REQUEST,
        'Failed to create new wishlist!',
      );
    }

    isCustomerExist.wishlist = newWishlist[0]._id.toString() as any;

    await isCustomerExist!.save({ session });

    newWishlistData = newWishlist[0];

    // Commit the transaction
    await session.commitTransaction();
    await session.endSession();
  } catch (error) {
    // Abort the transaction on error
    await session.abortTransaction();
    await session.endSession();
    throw error;
  }

  // Populate the author field before returning the new book data
  if (newWishlistData) {
    newWishlistData = await CustomerBookWishlist.findById(newWishlistData._id)
      .populate('customer')
      .populate('books.book');
  }

  return newWishlistData;
};

const getAllCustomerBookWishlists = async (): Promise<
  ICustomerBookWishlist[]
> => {
  const result = await CustomerBookWishlist.find()
    .populate('customer')
    .populate('books.book');

  return result;
};

const getAllCustomerBookWishlist = async (
  user: JwtPayload | null,
): Promise<ICustomerBookWishlist[] | null> => {
  const isCustomerExist = await Customer.findOne({ id: user!.userId });
  if (!isCustomerExist) {
    throw new ApiError(
      httpStatus.NOT_FOUND,
      'Sorry this customer does not exist!',
    );
  }

  const result = await CustomerBookWishlist.find({
    customer: isCustomerExist!._id,
  })
    .populate('customer')
    .populate('books.book');

  return result;
};

const removeBookFromCustomerBookWishlist = async (
  user: JwtPayload | null,
  id: string,
): Promise<IBook | null> => {
  // Check if the author exists
  const isCustomerExist = await Customer.findOne({ id: user!.userId });
  if (!isCustomerExist) {
    throw new ApiError(
      httpStatus.NOT_FOUND,
      'Sorry, this customer does not exist!',
    );
  }

  // check if the book exists
  const isBookExist = await Book.findOne({ _id: id });
  if (!isBookExist) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Book not found !');
  }

  const session = await mongoose.startSession();

  try {
    session.startTransaction();

    // delete book from the list first
    const manageWishlist = await CustomerBookWishlist.findOne(
      { customer: isCustomerExist!._id },
      null, // No projection needed
      { session }, // Correctly passing session here
    );

    if (!manageWishlist) {
      throw new ApiError(httpStatus.NOT_FOUND, 'Sorry customer not found!');
    }

    // Remove the book from the customer's books wishlist
    manageWishlist.books = manageWishlist.books.filter(
      book => book.book.toString() !== isBookExist._id.toString(),
    );

    // Save the updated manageBooks document (pass session in options, not in the document)
    await manageWishlist.save({ session });

    await session.commitTransaction();
    await session.endSession();

    return isBookExist;
  } catch (error) {
    await session.abortTransaction();
    throw error;
  }
};

const deleteBookFromCustomeBookWishList = async (
  id: string,
): Promise<ICustomerBookWishlist | null> => {
  const result = await CustomerBookWishlist.findByIdAndDelete(id);

  return result;
};

export const CustomerBookWishlistServices = {
  createCustomerBookWishlist,
  getAllCustomerBookWishlists,
  getAllCustomerBookWishlist,
  removeBookFromCustomerBookWishlist,
  deleteBookFromCustomeBookWishList,
};
