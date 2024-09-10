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
  // Check if the customer exists
  const isCustomerExist = await Customer.findOne({ id: user!.userId });
  if (!isCustomerExist) {
    throw new ApiError(
      httpStatus.NOT_FOUND,
      'Sorry, this customer does not exist!',
    );
  }

  let newCustomerBookWishlistData = null;
  const session = await mongoose.startSession();

  try {
    session.startTransaction();

    // Find the customer's books list
    let customerBookWishlists = await CustomerBookWishlist.findOne({
      customer: isCustomerExist._id,
    }).session(session);

    // Iterate over the payload.books to structure the customer books data
    const listBooks = payload.books.map(book => ({
      book: book.book, // book.book should either be an ObjectId or IBook
      addedAt: book.addedAt || new Date(), // Add current date if not provided
    }));

    const listData = {
      customer: isCustomerExist._id.toString(),
      books: listBooks,
    };

    // If no record exists for the customer, create a new one
    if (!customerBookWishlists) {
      const createdBooks = await CustomerBookWishlist.create([listData], {
        session,
      });
      customerBookWishlists = createdBooks[0];
    } else {
      // Update the existing record
      payload.books.forEach(bookPayload => {
        const bookId = bookPayload.book;

        // Check if the book already exists in the list
        const bookIndex = customerBookWishlists!.books.findIndex(
          entry => entry.book.toString() === bookId.toString(),
        );

        if (bookIndex > -1) {
          // Book exists, update its status
          throw new ApiError(
            httpStatus.BAD_REQUEST,
            'This book already exists',
          );
        } else {
          // If book doesn’t exist, add it with the new status
          customerBookWishlists!.books.push({
            book: bookId as any,
            addedAt: new Date(),
          });
        }
      });

      // Save the updated document
      await customerBookWishlists.save({ session });
    }

    if (!customerBookWishlists) {
      throw new ApiError(
        httpStatus.BAD_REQUEST,
        'Failed to create or update customer book list!',
      );
    }

    // Update the customer reference to the book list
    isCustomerExist.books = customerBookWishlists._id.toString() as any;
    await isCustomerExist.save({ session });

    newCustomerBookWishlistData = customerBookWishlists;

    // Commit the transaction
    await session.commitTransaction();
    await session.endSession();
  } catch (error) {
    // Abort the transaction on error
    await session.abortTransaction();
    await session.endSession();
    throw error;
  }

  // Populate customer and books before returning the updated data
  if (newCustomerBookWishlistData) {
    newCustomerBookWishlistData = await CustomerBookWishlist.findById(
      newCustomerBookWishlistData._id,
    )
      .populate('customer')
      .populate('books.book');
  }

  return newCustomerBookWishlistData;
};

const getAllCustomerBookWishlists = async (): Promise<
  ICustomerBookWishlist[]
> => {
  const result = await CustomerBookWishlist.find()
    .populate('customer')
    .populate('books.book');

  return result;
};

const getCustomerAllBookWishlist = async (
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
  bookId: string,
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
  const isBookExist = await Book.findOne({ _id: bookId });
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

    // books array length is zero then delete the book list
    if (manageWishlist.books.length === 0) {
      await CustomerBookWishlist.findOneAndDelete(
        { customer: isCustomerExist!._id },
        // null, // No projection needed
        { session }, // Correctly passing session here
      );
    }

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
  getCustomerAllBookWishlist,
  removeBookFromCustomerBookWishlist,
  deleteBookFromCustomeBookWishList,
};
