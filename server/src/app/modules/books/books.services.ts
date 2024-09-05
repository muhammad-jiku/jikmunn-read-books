/* eslint-disable no-undef */
/* eslint-disable @typescript-eslint/no-explicit-any */
import httpStatus from 'http-status';
import mongoose, { SortOrder } from 'mongoose';
import ApiError from '../../../errors/ApiError';
import { paginationHelpers } from '../../../helpers/paginationHelpers';
import { IGenericResponse } from '../../../interfaces/common';
import { IPaginationOptions } from '../../../interfaces/pagination';
import { Author } from '../authors/authors.model';
import { ManageBook } from '../manageBooks/manageBooks.model';
import { bookSearchableFields } from './books.constants';
import { IBook, IBookFilters } from './books.interfaces';
import { Book } from './books.model';

const createBook = async (bookData: IBook): Promise<IBook | null> => {
  let newBookData = null;
  const session = await mongoose.startSession();
  try {
    session.startTransaction();

    console.log(bookData);
    // Check if the author exists
    const isAuthorExist = await Author.findOne({ _id: bookData.author });
    if (!isAuthorExist) {
      throw new ApiError(
        httpStatus.NOT_FOUND,
        'Sorry, this author does not exist!',
      );
    }
    // console.log('session ', session);
    console.log('is author exist ', isAuthorExist);
    // Create the new book
    const newBook = await Book.create([bookData], { session });

    console.log('new book ', newBook);
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
  const { limit, page, skip, sortBy, sortOrder } =
    paginationHelpers.calculatePagination(paginationOptions);

  const { searchTerm, ...filtersData } = filters;

  const andConditions = [];

  if (searchTerm) {
    andConditions.push({
      $or: bookSearchableFields.map(field => ({
        [field]: {
          $regex: searchTerm,
          $paginationOptions: 'i',
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
  const result = await Book.findByIdAndDelete(id);

  return result;
};

export const BookServices = {
  createBook,
  getAllBooks,
  getBook,
  updateBook,
  deleteBook,
};
