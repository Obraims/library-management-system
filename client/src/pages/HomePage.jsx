import React, { useState, useEffect } from 'react';
import BookGrid from '../components/BookGrid';
import SearchBar from '../components/SearchBar';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export default function HomePage() {
  const [genres, setGenres] = useState([]);
  const [selectedGenre, setSelectedGenre] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetch(`${API_URL}/genres`)
      .then((res) => res.ok ? res.json() : [])
      .then((data) => setGenres(Array.isArray(data) ? data : []))
      .catch(() => setGenres([]));
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <div className="text-center max-w-2xl mx-auto space-y-2">
        <h1 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
          Library Catalog & Resource Center
        </h1>
        <p className="text-gray-600 text-sm sm:text-base">
          Browse our book collection, manage your personal reading list, and reserve study spaces.
        </p>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 justify-between items-center bg-white p-4 rounded-xl shadow-sm border border-gray-200">
        <div className="w-full sm:w-2/3">
          <SearchBar onSearch={setSearchTerm} />
        </div>
        <div className="w-full sm:w-1/3">
          <select
            value={selectedGenre}
            onChange={(e) => setSelectedGenre(e.target.value)}
            className="w-full px-3 py-2.5 border border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500 text-sm"
          >
            <option value="">All Genres</option>
            {genres.map((g) => (
              <option key={g.id} value={g.id}>{g.name}</option>
            ))}
          </select>
        </div>
      </div>

      <BookGrid genreId={selectedGenre} search={searchTerm} />
    </div>
  );
}
