import React from 'react';
import { Link } from 'react-router-dom';
import { useReadingList } from '../context/ReadingListContext';
import { Bookmark, Trash2, ArrowRight, BookOpen } from 'lucide-react';

export default function ReadingListPage() {
  const { items, removeBook, clearList } = useReadingList();

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8 border-b border-gray-200 pb-4">
        <div className="flex items-center space-x-3">
          <Bookmark className="w-8 h-8 text-indigo-600" />
          <h1 className="text-2xl font-bold text-gray-900">Your Reading List</h1>
        </div>
        {items.length > 0 && (
          <button
            onClick={clearList}
            className="flex items-center space-x-1 text-sm text-red-600 hover:text-red-700 bg-red-50 hover:bg-red-100 px-3 py-1.5 rounded-md transition-colors"
          >
            <Trash2 className="w-4 h-4" />
            <span>Clear Entire List</span>
          </button>
        )}
      </div>

      {items.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-xl shadow-sm border border-gray-100">
          <BookOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900">Your reading list is empty</h3>
          <p className="text-sm text-gray-500 mt-1 max-w-sm mx-auto">
            Explore the catalog and save books to your personal list to read or borrow later.
          </p>
          <Link
            to="/"
            className="mt-6 inline-flex items-center space-x-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 px-4 py-2 rounded-md transition-colors"
          >
            <span>Browse Book Catalog</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {items.map((book) => (
            <div
              key={book.id}
              className="bg-white p-5 rounded-lg shadow-sm border border-gray-200 flex flex-col md:flex-row justify-between items-start md:items-center space-y-4 md:space-y-0"
            >
              <div className="space-y-1">
                <Link to={`/books/${book.id}`} className="text-lg font-semibold text-indigo-900 hover:text-indigo-600">
                  {book.title}
                </Link>
                <p className="text-sm text-gray-600">by {book.author}</p>
                <div className="flex items-center space-x-3 text-xs text-gray-500 pt-1">
                  <span>ISBN: {book.isbn}</span>
                  {book.genre?.name && (
                    <span className="bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded-full font-medium">
                      {book.genre.name}
                    </span>
                  )}
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <Link
                  to={`/books/${book.id}`}
                  className="text-sm text-indigo-600 hover:text-indigo-800 font-medium px-3 py-1.5 rounded-md hover:bg-indigo-50 transition-colors"
                >
                  View Details
                </Link>
                <button
                  onClick={() => removeBook(book.id)}
                  className="p-1.5 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-md transition-colors"
                  title="Remove from Reading List"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
