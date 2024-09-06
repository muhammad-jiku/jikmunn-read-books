/* eslint-disable @typescript-eslint/no-explicit-any */
import httpStatus from 'http-status';
import { JwtPayload } from 'jsonwebtoken';
import mongoose from 'mongoose';
import ApiError from '../../../errors/ApiError';
import { IBook } from '../books/books.interfaces';
import { Book } from '../books/books.model';
import { Customer } from '../customers/customers.model';
import { ICustomerBooks } from './customersBooks.interfaces';
import { CustomersBooks } from './customersBooks.model';

// Function to update the book status for a customer
const updateCustomerBooksStatus = async (
  user: JwtPayload | null,
  bookId: string, // Book ID
  newStatus: 'reading' | 'plan to read' | 'finished', // The new status of the book
): Promise<ICustomerBooks | null> => {
  // Check if the author exists
  const isCustomerExist = await Customer.findOne({ id: user!.userId });
  if (!isCustomerExist) {
    throw new ApiError(
      httpStatus.NOT_FOUND,
      'Sorry, this customer does not exist!',
    );
  }

  let newCustomerBooksData = null;
  const session = await mongoose.startSession();

  try {
    session.startTransaction();

    // Find the customer’s books list
    let customerBooks = await CustomersBooks.findOne({
      customer: isCustomerExist._id,
    });

    // If no record exists for the customer, create a new one
    if (!customerBooks) {
      customerBooks = new CustomersBooks({
        customer: isCustomerExist._id,
        books: [
          {
            book: bookId,
            status: newStatus,
          },
        ],
      });
    } else {
      // Check if the book already exists in the list
      const bookIndex = customerBooks.books.findIndex(
        entry => entry.book.toString() === bookId,
      );

      if (bookIndex > -1) {
        // Book exists, update its status and update time
        customerBooks.books[bookIndex].status = newStatus;
      } else {
        // If book doesn’t exist, add it with the new status
        customerBooks.books.push({
          book: bookId as any,
          status: newStatus,
        });
      }
    }

    // Save the updated document
    await customerBooks.save({ session });

    if (!customerBooks) {
      throw new ApiError(
        httpStatus.BAD_REQUEST,
        'Failed to create customer book lists!',
      );
    }

    isCustomerExist.books = customerBooks._id.toString() as any;

    await isCustomerExist!.save({ session });

    newCustomerBooksData = customerBooks;

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
  if (newCustomerBooksData) {
    newCustomerBooksData = await CustomersBooks.findById(
      newCustomerBooksData._id,
    )
      .populate('customer')
      .populate('books.book');
  }

  return newCustomerBooksData;
};

const getAllCustomerBookLists = async (): Promise<ICustomerBooks[] | null> => {
  const result = await CustomersBooks.find()
    .populate('customer')
    .populate('books.book');

  return result;
};

const getAllCustomerBooksByStatus = async (
  user: JwtPayload | null,
): Promise<ICustomerBooks | null> => {
  const isCustomerExist = await Customer.findOne({ id: user!.userId });
  if (!isCustomerExist) {
    throw new ApiError(
      httpStatus.NOT_FOUND,
      'Sorry this customer does not exist!',
    );
  }

  const result = await CustomersBooks.findOne({
    customer: isCustomerExist!._id,
  })
    .populate('customer')
    .populate('books.book');

  return result;
};

const removeCustomerBookFromList = async (
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
    const manageList = await CustomersBooks.findOne(
      { customer: isCustomerExist!._id },
      null, // No projection needed
      { session }, // Correctly passing session here
    );

    if (!manageList) {
      throw new ApiError(httpStatus.NOT_FOUND, 'Sorry customer not found!');
    }

    // Remove the book from the customer's books wishlist
    manageList.books = manageList.books.filter(
      book => book.book.toString() !== isBookExist._id.toString(),
    );

    // Save the updated manageBooks document (pass session in options, not in the document)
    await manageList.save({ session });

    await session.commitTransaction();
    await session.endSession();

    return isBookExist;
  } catch (error) {
    await session.abortTransaction();
    throw error;
  }
};

export const CustomerBooksServices = {
  updateCustomerBooksStatus,
  getAllCustomerBookLists,
  getAllCustomerBooksByStatus,
  removeCustomerBookFromList,
};
