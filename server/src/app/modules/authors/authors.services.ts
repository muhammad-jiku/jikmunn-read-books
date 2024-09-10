/* eslint-disable @typescript-eslint/no-explicit-any */
import httpStatus from 'http-status';
import mongoose, { SortOrder } from 'mongoose';
import ApiError from '../../../errors/ApiError';
import { paginationHelpers } from '../../../helpers/paginationHelpers';
import { IGenericResponse } from '../../../interfaces/common';
import { IPaginationOptions } from '../../../interfaces/pagination';
import { Book } from '../books/books.model';
import { CustomerBookList } from '../customerBookLists/customerBookLists.model';
import { CustomerBookWishlist } from '../customerBookWishlists/customerBookWishlists.model';
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
  // Check if the author exists
  const isAuthorExist = await Author.findOne({ id });

  if (!isAuthorExist) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Author not found!');
  }

  const session = await mongoose.startSession();

  try {
    session.startTransaction();

    // Check if the book exists
    const isBookExist = await Book.findOne({ author: isAuthorExist._id });

    // check if author's book list exists
    const authorsBookList = await ManageBook.findOne(
      { author: isAuthorExist._id },
      null,
      { session },
    );

    if (isBookExist) {
      // Delete book from customer list if it exists
      const manageBookLists = await CustomerBookList.findOne(
        { 'books.book': isBookExist!._id },
        null,
        { session },
      );
      if (manageBookLists) {
        manageBookLists.books = manageBookLists.books.filter(
          book => book.book.toString() !== isBookExist!._id.toString(),
        );

        await manageBookLists.save({ session });

        if (manageBookLists.books.length === 0) {
          await CustomerBookList.findByIdAndDelete(manageBookLists!._id, {
            session,
          });
        }
      }

      // Delete book from customer wishlist if it exists
      const manageBookWishlists = await CustomerBookWishlist.findOne(
        { 'books.book': isBookExist!._id },
        null,
        { session },
      );
      if (manageBookWishlists) {
        manageBookWishlists.books = manageBookWishlists.books.filter(
          book => book.book.toString() !== isBookExist!._id.toString(),
        );

        await manageBookWishlists.save({ session });

        if (manageBookWishlists.books.length === 0) {
          await CustomerBookWishlist.findByIdAndDelete(
            manageBookWishlists!._id,
            {
              session,
            },
          );
        }
      }

      if (authorsBookList) {
        // Delete author's manage book list
        const deletedAuthorsBookList = await ManageBook.findByIdAndDelete(
          authorsBookList._id,
          { session },
        );
        if (!deletedAuthorsBookList) {
          throw new ApiError(
            httpStatus.NOT_FOUND,
            "Failed to delete author's book list!",
          );
        }
      }

      // Delete the book itself
      const deletedBook = await Book.findByIdAndDelete(isBookExist._id, {
        session,
      });
      if (!deletedBook) {
        throw new ApiError(
          httpStatus.NOT_FOUND,
          "Failed to delete author's book!",
        );
      }
    }

    // Delete author
    const author = await Author.findOneAndDelete({ id }, { session });
    if (!author) {
      throw new ApiError(httpStatus.NOT_FOUND, 'Failed to delete author');
    }

    // Delete user
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
