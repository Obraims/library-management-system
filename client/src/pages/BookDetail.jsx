import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useReadingList } from '../context/ReadingListContext';
import { ArrowLeft, Bookmark, BookmarkCheck, BookOpen, Star } from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export default function BookDetail() {
  const { id } = useParams();
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const { items, addBook, removeBook } = useReadingList();
  const isSaved = items.some(item => item.id === id);

  useEffect(() => {
    fetch(`${API_URL}/books/${id}`)
      .then((res) => {
        if (!res.ok) throw new Error('Book not found');
        return res.json();
      })
      .then((data) => {
        setBook(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, [id]);

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12 flex justify-center">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (error || !book) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12 text-center">
        <h2 className="text-2xl font-bold text-gray-900">Book Not Found</h2>
        <Link to="/" className="mt-4 inline-block text-indigo-600 font-medium hover:underline">
          &larr; Back to Catalog
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
      <Link to="/" className="inline-flex items-center space-x-1 text-sm font-medium text-indigo-600 hover:text-indigo-800">
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Catalog</span>
      </Link>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 space-y-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 pb-6 border-b border-gray-200">
          <div>
            <span className="text-xs font-semibold px-3 py-1 rounded-full bg-indigo-50 text-indigo-700">
              {book.genre?.name || 'General'}
            </span>
            <h1 className="text-3xl font-bold text-gray-900 mt-2">{book.title}</h1>
            <p className="text-lg text-gray-600">by {book.author}</p>
          </div>

          <button
            onClick={() => isSaved ? removeBook(book.id) : addBook(book)}
            className={`flex items-center space-x-2 px-4 py-2.5 rounded-lg text-sm font-semibold transition-colors ${
              isSaved
                ? 'bg-amber-100 text-amber-900 hover:bg-amber-200'
                : 'bg-indigo-600 text-white hover:bg-indigo-700'
            }`}
          >
            {isSaved ? <BookmarkCheck className="w-5 h-5 text-amber-600" /> : <Bookmark className="w-5 h-5" />}
            <span>{isSaved ? 'Saved to Reading List' : 'Add to Reading List'}</span>
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm text-gray-600 bg-gray-50 p-4 rounded-lg">
          <div>
            <span className="block text-xs text-gray-400">Published</span>
            <span className="font-medium text-gray-900">{book.publishedYr}</span>
          </div>
          <div>
            <span className="block text-xs text-gray-400">ISBN</span>
            <span className="font-medium text-gray-900">{book.isbn}</span>
          </div>
          <div>
            <span className="block text-xs text-gray-400">Total Copies</span>
            <span className="font-medium text-gray-900">{book.totalCopies || 1}</span>
          </div>
          <div>
            <span className="block text-xs text-gray-400">Status</span>
            <span className="font-medium text-emerald-600">Available</span>
          </div>
        </div>
      </div>
    </div>
  );
}
