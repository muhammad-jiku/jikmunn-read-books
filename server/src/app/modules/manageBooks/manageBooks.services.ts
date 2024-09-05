import httpStatus from 'http-status';
import { JwtPayload } from 'jsonwebtoken';
import ApiError from '../../../errors/ApiError';
import { Author } from '../authors/authors.model';
import { IManageBooks } from './manageBooks.interfaces';
import { ManageBook } from './manageBooks.model';

const getAllManageBooks = async (): Promise<IManageBooks[] | null> => {
  const result = await ManageBook.find()
    .populate('author')
    .populate('books.book');

  return result;
};

const getAllManageBook = async (
  user: JwtPayload | null,
): Promise<IManageBooks | null> => {
  const isAuthorExist = await Author.findOne({ id: user!.userId });
  if (!isAuthorExist) {
    throw new ApiError(
      httpStatus.NOT_FOUND,
      'Sorry this author does not exist!',
    );
  }

  const result = await ManageBook.findOne({ author: isAuthorExist!._id })
    .populate('author')
    .populate('books.book');

  return result;
};

export const ManageBookServices = { getAllManageBooks, getAllManageBook };
