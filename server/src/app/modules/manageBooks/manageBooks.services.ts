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
  const result = await ManageBook.findByIdAndDelete(id);

  return result;
};

export const ManageBookServices = {
  getAllManageBooks,
  getAllManageBooksByAuthor,
  deleteManageBook,
};
