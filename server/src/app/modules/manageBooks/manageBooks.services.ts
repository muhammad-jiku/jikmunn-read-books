import httpStatus from 'http-status';
import { JwtPayload } from 'jsonwebtoken';
import ApiError from '../../../errors/ApiError';
import { Author } from '../authors/authors.model';
import { IManageBook } from './manageBooks.interfaces';
import { ManageBook } from './manageBooks.model';

const getAllManageBooks = async (): Promise<IManageBook[] | null> => {
  const result = await ManageBook.find()
    .populate('author')
    .populate('books.book');

  return result;
};

const getAllManageBooksByAuthor = async (
  user: JwtPayload | null,
): Promise<IManageBook[] | null> => {
  const isAuthorExist = await Author.findOne({ id: user!.userId });
  if (!isAuthorExist) {
    throw new ApiError(
      httpStatus.NOT_FOUND,
      'Sorry this author does not exist!',
    );
  }

  const result = await ManageBook.find({ author: isAuthorExist!._id })
    .populate('author')
    .populate('books.book');

  return result;
};

const deleteManageBook = async (id: string): Promise<IManageBook | null> => {
  // Find the ManageBook by id and populate its author and books
  const manageBook = await ManageBook.findById(id)
    .populate('author')
    .populate('books.book');

  if (!manageBook) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Manage book not found');
  }

  // Find the associated author
  const isAuthorExist = await Author.findOne({ _id: manageBook.author });
  if (!isAuthorExist) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Author not found');
  }

  // If the manageBook in the author is the one we are deleting, remove it
  if (isAuthorExist.manageBook?.toString() === id) {
    // Use $unset to remove the manageBook field
    await Author.updateOne(
      { _id: isAuthorExist._id },
      { $unset: { manageBook: '' } },
    );
    // console.log(isAuthorExist.manageBook?.toString() === id);
  }

  // Now delete the ManageBook document
  await ManageBook.findByIdAndDelete(id);

  return manageBook;
};

export const ManageBookServices = {
  getAllManageBooks,
  getAllManageBooksByAuthor,
  deleteManageBook,
};
