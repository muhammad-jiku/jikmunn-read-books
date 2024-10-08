/* eslint-disable @typescript-eslint/no-explicit-any */
import httpStatus from 'http-status';
import { JwtPayload } from 'jsonwebtoken';
import mongoose from 'mongoose';
import ApiError from '../../../errors/ApiError';
import { IBook } from '../books/books.interfaces';
import { Book } from '../books/books.model';
import { Customer } from '../customers/customers.model';
import { ICustomerBookList } from './customerBookLists.interfaces';
import { CustomerBookList } from './customerBookLists.model';

// Function to update the book status for a customer
const createCustomerBookListStatus = async (
  user: JwtPayload | null,
  payload: ICustomerBookList,
): Promise<ICustomerBookList | null> => {
  // Check if the customer exists
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

    // Find the customer's books list
    let customerBookLists = await CustomerBookList.findOne({
      customer: isCustomerExist._id,
    }).session(session);

    // Iterate over the payload.books to structure the customer books data
    const listBooks = payload.books.map(book => ({
      book: book.book, // book.book should either be an ObjectId or IBook
      status: book.status, // book.status should either be 'reading', 'plan to read', or 'finished'
      addedAt: book.addedAt || new Date(), // Add current date if not provided
    }));

    const listData = {
      customer: isCustomerExist._id.toString(),
      books: listBooks,
    };

    // If no record exists for the customer, create a new one
    if (!customerBookLists) {
      const createdBooks = await CustomerBookList.create([listData], {
        session,
      });
      customerBookLists = createdBooks[0];
    } else {
      // Update the existing record
      payload.books.forEach(bookPayload => {
        const bookId = bookPayload.book;
        const newStatus = bookPayload.status;

        // Check if the book already exists in the list
        const bookIndex = customerBookLists!.books.findIndex(
          entry => entry.book.toString() === bookId.toString(),
        );

        if (bookIndex > -1) {
          // Book exists, update its status
          customerBookLists!.books[bookIndex].status = newStatus;
        } else {
          // If book doesn’t exist, add it with the new status
          customerBookLists!.books.push({
            book: bookId as any,
            status: newStatus,
            addedAt: new Date(),
          });
        }
      });

      // Save the updated document
      await customerBookLists.save({ session });
    }

    if (!customerBookLists) {
      throw new ApiError(
        httpStatus.BAD_REQUEST,
        'Failed to create or update customer book list!',
      );
    }

    // Update the customer reference to the book list
    isCustomerExist.books = customerBookLists._id.toString() as any;
    await isCustomerExist.save({ session });

    newCustomerBooksData = customerBookLists;

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
  if (newCustomerBooksData) {
    newCustomerBooksData = await CustomerBookList.findById(
      newCustomerBooksData._id,
    )
      .populate('customer')
      .populate('books.book');
  }

  return newCustomerBooksData;
};

const getAllCustomerBookLists = async (): Promise<
  ICustomerBookList[] | null
> => {
  const result = await CustomerBookList.find()
    .populate('customer')
    .populate('books.book');

  return result;
};

const getCustomerAllBookList = async (
  user: JwtPayload | null,
): Promise<ICustomerBookList[] | null> => {
  const isCustomerExist = await Customer.findOne({ id: user!.userId });
  if (!isCustomerExist) {
    throw new ApiError(
      httpStatus.NOT_FOUND,
      'Sorry this customer does not exist!',
    );
  }

  const result = await CustomerBookList.find({
    customer: isCustomerExist!._id,
  })
    .populate('customer')
    .populate('books.book');

  return result;
};

const removeCustomerBookFromList = async (
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

    // find book from the list first
    const manageList = await CustomerBookList.findOne(
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

    // if books array length is zero then delete the book list
    if (manageList.books.length === 0) {
      await CustomerBookList.findOneAndDelete(
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

const deleteCustomerBookFromList = async (
  id: string,
): Promise<ICustomerBookList | null> => {
  const result = await CustomerBookList.findByIdAndDelete(id);

  return result;
};

export const CustomerBookListServices = {
  createCustomerBookListStatus,
  getAllCustomerBookLists,
  getCustomerAllBookList,
  removeCustomerBookFromList,
  deleteCustomerBookFromList,
};
