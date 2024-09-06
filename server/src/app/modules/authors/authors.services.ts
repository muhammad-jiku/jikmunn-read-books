/* eslint-disable @typescript-eslint/no-explicit-any */
import httpStatus from 'http-status';
import mongoose, { SortOrder } from 'mongoose';
import ApiError from '../../../errors/ApiError';
import { paginationHelpers } from '../../../helpers/paginationHelpers';
import { IGenericResponse } from '../../../interfaces/common';
import { IPaginationOptions } from '../../../interfaces/pagination';
import { Book } from '../books/books.model';
import { ManageBook } from '../manageBooks/manageBooks.model';
import { User } from '../users/users.model';
import { authorSearchableFields } from './authors.constants';
import { IAuthor, IAuthorFilters } from './authors.interfaces';
import { Author } from './authors.model';

const getAllAuthors = async (
  filters: IAuthorFilters,
  paginationOptions: IPaginationOptions,
): Promise<IGenericResponse<IAuthor[]>> => {
  // Extract searchTerm to implement search query
  const { searchTerm, ...filtersData } = filters;
  const { page, limit, skip, sortBy, sortOrder } =
    paginationHelpers.calculatePagination(paginationOptions);

  const andConditions = [];
  // Search needs $or for searching in specified fields
  if (searchTerm) {
    andConditions.push({
      $or: authorSearchableFields.map(field => ({
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

  const result = await Author.find(whereConditions)
    .populate({
      path: 'manageBook',
      populate: [
        {
          path: 'books.book',
        },
      ],
    })
    .sort(sortConditions)
    .skip(skip)
    .limit(limit);

  const total = await Author.countDocuments(whereConditions);

  return {
    meta: {
      page,
      limit,
      total,
    },
    data: result,
  };
};

const getAuthor = async (id: string): Promise<IAuthor | null> => {
  const result = await Author.findOne({ id }).populate({
    path: 'manageBook',
    populate: [
      {
        path: 'books.book',
      },
    ],
  });

  return result;
};

const updateAuthor = async (
  id: string,
  payload: Partial<IAuthor>,
): Promise<IAuthor | null> => {
  // Check if the author exists
  const existingAuthor = await Author.findOne({ id });
  if (!existingAuthor) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Author information not found!');
  }

  const { name, ...authorData } = payload;

  // Prepare conditions for checking unique fields
  const uniqueConditions = [];
  if (authorData.id) {
    uniqueConditions.push({ id: authorData.id });
  }
  if (authorData.email) {
    uniqueConditions.push({ email: authorData.email });
  }
  if (authorData.contactNo) {
    uniqueConditions.push({ contactNo: authorData.contactNo });
  }

  // Check for uniqueness of fields
  if (uniqueConditions.length > 0) {
    const isDuplicate = await Author.findOne({ $or: uniqueConditions });
    if (isDuplicate) {
      throw new ApiError(
        httpStatus.BAD_REQUEST,
        'Please check the data, it seems like value of the fields that you provided are already exists!',
      );
    }
  }

  // Prepare the updated author data
  const updatedAuthorData: Partial<IAuthor> = { ...authorData };

  if (name && Object.keys(name).length > 0) {
    Object.keys(name).forEach(key => {
      const nameKey = `name.${key}` as keyof Partial<IAuthor>;
      (updatedAuthorData as any)[nameKey] = name[key as keyof typeof name];
    });
  }

  // Update and return the author document
  const result = await Author.findOneAndUpdate({ id }, updatedAuthorData, {
    new: true,
  }).populate({
    path: 'manageBook',
    populate: [
      {
        path: 'books.book',
      },
    ],
  });

  return result;
};

const deleteAuthor = async (id: string): Promise<IAuthor | null> => {
  // check if the author is exist
  const isExist = await Author.findOne({ id });

  if (!isExist) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Author not found !');
  }

  const session = await mongoose.startSession();

  try {
    session.startTransaction();

    // delete author's book list first
    const authorsBookList = await ManageBook.findOneAndDelete(
      { author: isExist._id },
      { session },
    );
    if (!authorsBookList) {
      throw new ApiError(
        httpStatus.NOT_FOUND,
        "Failed to delete author's book list",
      );
    }

    // delete book then
    const book = await Book.findOneAndDelete(
      { author: isExist._id },
      { session },
    );
    if (!book) {
      throw new ApiError(
        httpStatus.NOT_FOUND,
        "Failed to delete author's book!",
      );
    }

    // delete author then
    const author = await Author.findOneAndDelete({ id }, { session });
    if (!author) {
      throw new ApiError(httpStatus.NOT_FOUND, 'Failed to delete author');
    }

    //delete user
    await User.deleteOne({ id });
    await session.commitTransaction();
    await session.endSession();

    return author;
  } catch (error) {
    await session.abortTransaction();
    throw error;
  }
};

export const AuthorServices = {
  getAllAuthors,
  getAuthor,
  updateAuthor,
  deleteAuthor,
};
