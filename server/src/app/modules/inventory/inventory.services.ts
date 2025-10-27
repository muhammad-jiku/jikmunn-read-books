/* eslint-disable @typescript-eslint/explicit-function-return-type */
import httpStatus from 'http-status';
import ApiError from '../../../errors/ApiError';
import { Book } from '../books/books.model';

const getLowStockBooks = async (threshold = 10) => {
  const lowStockBooks = await Book.find({
    stock: { $lte: threshold },
    isAvailable: true,
  }).populate('author');

  return lowStockBooks;
};

const updateStock = async (bookId: string, newStock: number) => {
  const book = await Book.findById(bookId);
  if (!book) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Book not found');
  }

  book.stock = newStock;
  book.isAvailable = newStock > 0;
  await book.save();

  return book;
};

const restockBook = async (bookId: string, quantity: number) => {
  const book = await Book.findById(bookId);
  if (!book) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Book not found');
  }

  book.stock += quantity;
  book.isAvailable = true;
  await book.save();

  return book;
};

const getInventoryReport = async () => {
  const totalBooks = await Book.countDocuments();
  const availableBooks = await Book.countDocuments({ isAvailable: true });
  const outOfStockBooks = await Book.countDocuments({ isAvailable: false });
  const lowStockBooks = await Book.countDocuments({ stock: { $lte: 10 } });

  const inventoryValue = await Book.aggregate([
    {
      $group: {
        _id: null,
        totalValue: { $sum: { $multiply: ['$price', '$stock'] } },
      },
    },
  ]);

  return {
    totalBooks,
    availableBooks,
    outOfStockBooks,
    lowStockBooks,
    totalValue: inventoryValue[0]?.totalValue || 0,
  };
};

export const InventoryServices = {
  getLowStockBooks,
  updateStock,
  restockBook,
  getInventoryReport,
};
