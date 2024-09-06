/* eslint-disable @typescript-eslint/no-explicit-any */
import httpStatus from 'http-status';
import { JwtPayload } from 'jsonwebtoken';
import mongoose from 'mongoose';
import ApiError from '../../../errors/ApiError';
import { IBook } from '../books/books.interfaces';
import { Book } from '../books/books.model';
import { Customer } from '../customers/customers.model';
import { ICustomerWishlists } from './customersWishlists.interfaces';
import { CustomersWishlist } from './customersWishlists.model';

const createCustomersWishlist = async (
  user: JwtPayload | null,
  payload: ICustomerWishlists,
): Promise<ICustomerWishlists | null> => {
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
    const newWishlist = await CustomersWishlist.create([wishlistData], {
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
    newWishlistData = await CustomersWishlist.findById(newWishlistData._id)
      .populate('customer')
      .populate('books.book');
  }

  return newWishlistData;
};

const getAllCustomersWishlists = async (): Promise<
  ICustomerWishlists[] | null
> => {
  const result = await CustomersWishlist.find()
    .populate('customer')
    .populate('books.book');

  return result;
};

const getAllCustomersWishlist = async (
  user: JwtPayload | null,
): Promise<ICustomerWishlists | null> => {
  const isCustomerExist = await Customer.findOne({ id: user!.userId });
  if (!isCustomerExist) {
    throw new ApiError(
      httpStatus.NOT_FOUND,
      'Sorry this customer does not exist!',
    );
  }

  const result = await CustomersWishlist.findOne({
    customer: isCustomerExist!._id,
  })
    .populate('customer')
    .populate('books.book');

  return result;
};

const removeBookFromWishlist = async (
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
    const manageWishlist = await CustomersWishlist.findOne(
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

export const CustomersWishlistsServices = {
  createCustomersWishlist,
  getAllCustomersWishlists,
  getAllCustomersWishlist,
  removeBookFromWishlist,
};
