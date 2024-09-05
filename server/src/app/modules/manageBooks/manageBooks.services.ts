import { IManageBooks } from './manageBooks.interfaces';
import { ManageBook } from './manageBooks.model';

const getAllManageBooks = async (): Promise<IManageBooks[] | null> => {
  const result = await ManageBook.find()
    .populate('author')
    .populate('books.book');

  return result;
};

export const ManageBookServices = { getAllManageBooks };
