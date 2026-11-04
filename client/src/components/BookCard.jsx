import React from 'react';
import { Link } from 'react-router-dom';
import { useReadingList } from '../context/ReadingListContext';
import { Bookmark, BookmarkCheck } from 'lucide-react';

export default function BookCard({ book }) {
  const { items, addBook, removeBook } = useReadingList();
  const isSaved = items.some(item => item.id === book.id);

  const toggleSave = (e) => {
    e.preventDefault();
    if (isSaved) {
      removeBook(book.id);
    } else {
      addBook(book);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm hover:shadow-md border border-gray-100 flex flex-col justify-between p-5 transition-shadow">
      <div>
        <div className="flex justify-between items-start">
          <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-indigo-50 text-indigo-700">
            {book.genre?.name || 'General'}
          </span>
          <button
            onClick={toggleSave}
            className={`p-1.5 rounded-full transition-colors ${
              isSaved ? 'text-amber-500 bg-amber-50' : 'text-gray-400 hover:text-gray-600 hover:bg-gray-50'
            }`}
            title={isSaved ? 'Remove from reading list' : 'Add to reading list'}
          >
            {isSaved ? <BookmarkCheck className="w-5 h-5 fill-amber-500" /> : <Bookmark className="w-5 h-5" />}
          </button>
        </div>

        <Link to={`/books/${book.id}`} className="mt-3 block group">
          <h3 className="text-lg font-bold text-gray-900 group-hover:text-indigo-600 transition-colors line-clamp-2">
            {book.title}
          </h3>
          <p className="text-sm text-gray-600 mt-1">by {book.author}</p>
        </Link>
      </div>

      <div className="mt-5 pt-4 border-t border-gray-100 flex justify-between items-center text-xs text-gray-500">
        <span>Published {book.publishedYr}</span>
        <Link
          to={`/books/${book.id}`}
          className="font-semibold text-indigo-600 hover:text-indigo-800 transition-colors"
        >
          Details &rarr;
        </Link>
      </div>
    </div>
  );
}
