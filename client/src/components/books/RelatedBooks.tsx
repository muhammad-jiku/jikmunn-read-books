import React from 'react';
import type { Book } from '../../types/book';
import BookCard from './BookCard';

interface RelatedBooksProps {
  books: Book[];
}

const RelatedBooks: React.FC<RelatedBooksProps> = ({ books }) => {
  return (
    <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6'>
      {books.map((book) => (
        <BookCard key={book.id} book={book} />
      ))}
    </div>
  );
};

export default RelatedBooks;
