import React, { useState, useEffect } from 'react';
import BookCard from './BookCard';
import { BookOpen, AlertTriangle } from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export default function BookGrid({ genreId, search }) {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;
    setLoading(true);
    setError(null);

    const queryParams = new URLSearchParams();
    if (genreId) queryParams.append('genreId', genreId);
    if (search) queryParams.append('search', search);

    fetch(`${API_URL}/books?${queryParams.toString()}`)
      .then((res) => {
        if (!res.ok) throw new Error('Failed to load books');
        return res.json();
      })
      .then((data) => {
        if (isMounted) {
          setBooks(Array.isArray(data) ? data : data.data || []);
          setLoading(false);
        }
      })
      .catch((err) => {
        if (isMounted) {
          setError(err.message);
          setLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [genreId, search]);

  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3, 4, 5, 6].map((n) => (
          <div key={n} className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm animate-pulse space-y-4">
            <div className="h-4 bg-gray-200 rounded w-1/3"></div>
            <div className="h-6 bg-gray-200 rounded w-3/4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 bg-red-50 border border-red-200 rounded-xl text-center text-red-700 space-y-2">
        <AlertTriangle className="w-8 h-8 text-red-500 mx-auto" />
        <p className="font-semibold">{error}</p>
      </div>
    );
  }

  if (books.length === 0) {
    return (
      <div className="text-center py-12 bg-white rounded-xl border border-gray-100 p-8">
        <BookOpen className="w-12 h-12 text-gray-300 mx-auto mb-3" />
        <h3 className="text-lg font-medium text-gray-900">No books found</h3>
        <p className="text-sm text-gray-500 mt-1">Try adjusting your search query or selecting a different genre.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {books.map((book) => (
        <BookCard key={book.id} book={book} />
      ))}
    </div>
  );
}
