/* eslint-disable @typescript-eslint/no-explicit-any */
import httpStatus from 'http-status';
import mongoose, { SortOrder } from 'mongoose';
import ApiError from '../../../errors/ApiError';
import { paginationHelpers } from '../../../helpers/paginationHelpers';
import { IGenericResponse } from '../../../interfaces/common';
import { IPaginationOptions } from '../../../interfaces/pagination';
import { Author } from '../authors/authors.model';
import { CustomerBookList } from '../customerBookLists/customerBookLists.model';
import { CustomerBookWishlist } from '../customerBookWishlists/customerBookWishlists.model';
import { ManageBook } from '../manageBooks/manageBooks.model';
import { bookSearchableFields } from './books.constants';
import { IBook, IBookFilters } from './books.interfaces';
import { Book } from './books.model';

const createBook = async (bookData: IBook): Promise<IBook | null> => {
  let newBookData = null;
  const session = await mongoose.startSession();
  try {
    session.startTransaction();

    // Check if the author exists
    const isAuthorExist = await Author.findOne({ _id: bookData.author });
    if (!isAuthorExist) {
      throw new ApiError(
        httpStatus.NOT_FOUND,
        'Sorry, this author does not exist!',
      );
    }

    // Create the new book
    const newBook = await Book.create([bookData], { session });

    if (!newBook.length) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'Failed to create new book!');
    }

    // Find or create the ManageBook document
    let manageBooks = await ManageBook.findOne({
      author: bookData.author,
    }).session(session);

    if (!manageBooks) {
      // Create a new ManageBook record if it doesn't exist
      manageBooks = new ManageBook({
        author: bookData.author,
        books: [{ book: newBook[0]._id }],
      });
      await manageBooks.save({ session });
    } else {
      // Add the new book to the existing ManageBook record
      manageBooks.books.push({
        book: newBook[0]._id as any,
      });
      await manageBooks.save({ session });
    }

    isAuthorExist.manageBook = manageBooks._id.toString() as any;

    await isAuthorExist!.save({ session });

    newBookData = newBook[0];

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
  if (newBookData) {
    newBookData = await Book.findById(newBookData._id).populate('author');
  }

  return newBookData;
};

const getAllBooks = async (
  filters: IBookFilters,
  paginationOptions: IPaginationOptions,
): Promise<IGenericResponse<IBook[]>> => {
  // Extract searchTerm to implement search query
  const { searchTerm, ...filtersData } = filters;
  const { page, limit, skip, sortBy, sortOrder } =
    paginationHelpers.calculatePagination(paginationOptions);

  const andConditions = [];
  // Search needs $or for searching in specified fields
  if (searchTerm) {
    andConditions.push({
      $or: bookSearchableFields.map(field => ({
        [field]: {
          $regex: searchTerm,
          $options: 'i',
        },
      })),
    });
  }

  // Filters needs $and to fullfill all the conditions
  if (Object.keys(filtersData).length) {
    andConditions.push({
      $and: Object.entries(filtersData).map(([field, value]) => ({
        [field]: value,
      })),
    });
  }

  // Dynamic  Sort needs  field to  do sorting
  const sortConditions: { [key: string]: SortOrder } = {};
  if (sortBy && sortOrder) {
    sortConditions[sortBy] = sortOrder;
  }
  const whereConditions =
    andConditions.length > 0 ? { $and: andConditions } : {};

  const result = await Book.find(whereConditions)
    .populate('author')
    .sort(sortConditions)
    .skip(skip)
    .limit(limit);

  const total = await Book.countDocuments();

  return {
    meta: {
      page,
      limit,
      total,
    },
    data: result,
  };
};

const getBook = async (id: string): Promise<IBook | null> => {
  const result = await Book.findById(id).populate('author');

  return result;
};

const updateBook = async (
  id: string,
  bookData: Partial<IBook>,
): Promise<IBook | null> => {
  const result = await Book.findOneAndUpdate({ _id: id }, bookData, {
    new: true,
  }).populate('author');

  return result;
};

const deleteBook = async (id: string): Promise<IBook | null> => {
  // Check if the book exists
  const isBookExist = await Book.findOne({ _id: id });
  if (!isBookExist) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Book not found!');
  }

  const session = await mongoose.startSession();

  try {
    session.startTransaction();

    // Find book from the manage book list first
    const manageBooks = await ManageBook.findOne(
      { author: isBookExist!.author },
      null,
      { session },
    );
    if (manageBooks) {
      // Remove the book from the author's books list
      manageBooks.books = manageBooks.books.filter(
        book => book.book.toString() !== isBookExist._id.toString(),
      );

      // Save the updated manageBooks document
      await manageBooks.save({ session });

      // If books array length is zero, then delete the book list
      if (manageBooks.books.length === 0) {
        await ManageBook.findOneAndDelete(
          { author: isBookExist!.author },
          { session },
        );
      }
    } else {
      throw new ApiError(httpStatus.NOT_FOUND, 'Sorry, author not found!');
    }

    // Delete book from customer list if it exists
    const manageBookLists = await CustomerBookList.findOne(
      { 'books.book': isBookExist._id },
      null,
      { session },
    );
    if (manageBookLists) {
      // Remove the book from the customer's books list
      manageBookLists.books = manageBookLists.books.filter(
        book => book.book.toString() !== isBookExist._id.toString(),
      );

      // Save the updated manageBooks document
      await manageBookLists.save({ session });

      // If books array length is zero, then delete the book list
      if (manageBookLists.books.length === 0) {
        await CustomerBookList.findByIdAndDelete(manageBookLists._id, {
          session,
        });
      }
    }

    // Delete book from customer wishlist if it exists
    const manageBookWishlists = await CustomerBookWishlist.findOne(
      { 'books.book': isBookExist._id },
      null,
      { session },
    );
    if (manageBookWishlists) {
      // Remove the book from the customer's wishlist
      manageBookWishlists.books = manageBookWishlists.books.filter(
        book => book.book.toString() !== isBookExist._id.toString(),
      );

      // Save the updated manageBooks document
      await manageBookWishlists.save({ session });

      // If books array length is zero, then delete the wishlist
      if (manageBookWishlists.books.length === 0) {
        await CustomerBookWishlist.findByIdAndDelete(manageBookWishlists._id, {
          session,
        });
      }
    }

    // Delete the book from the books collection
    await Book.deleteOne({ _id: isBookExist._id }, { session });

    // Commit the transaction
    await session.commitTransaction();
    await session.endSession();

    return isBookExist;
  } catch (error) {
    await session.abortTransaction();
    throw error;
  }
};

export const BookServices = {
  createBook,
  getAllBooks,
  getBook,
  updateBook,
  deleteBook,
};
