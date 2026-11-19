import { useState, useEffect } from 'react';
import BookCard from './BookCard';
import { API_URL } from '../config/api';

function SkeletonCard() {
  return (
    <div className="book-card skeleton-card">
      <div className="skeleton-cover shimmer" />
      <div className="book-card-body">
        <div className="skeleton-line skeleton-tag shimmer" />
        <div className="skeleton-line skeleton-title shimmer" />
        <div className="skeleton-line skeleton-author shimmer" />
      </div>
      <div className="book-card-footer">
        <div className="skeleton-line skeleton-footer shimmer" />
      </div>
    </div>
  );
}

export default function BookGrid({ genreId, search, sortBy = 'default', onReset }) {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let active = true;
    setLoading(true);
    setError(null);

    const params = new URLSearchParams();
    if (genreId) params.append('genreId', genreId);
    if (search && search.trim()) params.append('search', search.trim());
    params.append('limit', '100');

    const endpoint = `${API_URL}/books?${params.toString()}`;

    fetch(endpoint)
      .then((res) => {
        if (!res.ok) throw new Error('Failed to load books');
        return res.json();
      })
      .then((json) => {
        if (!active) return;
        const list = Array.isArray(json) ? json : json.data || [];
        setBooks(list);
        setLoading(false);
      })
      .catch((err) => {
        if (!active) return;
        setError(err.message || 'Error connecting to the catalog.');
        setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [genreId, search]);

  const sortedList = [...books].sort((a, b) => {
    if (sortBy === 'title-asc') return (a.title || '').localeCompare(b.title || '');
    if (sortBy === 'title-desc') return (b.title || '').localeCompare(a.title || '');
    if (sortBy === 'author-asc') return (a.author || '').localeCompare(b.author || '');
    if (sortBy === 'author-desc') return (b.author || '').localeCompare(a.author || '');
    return 0;
  });

  if (loading) {
    return (
      <div className="catalog-section">
        <div className="catalog-header-info">
          <p className="catalog-count-loading">Loading books...</p>
        </div>
        <div className="book-grid">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
            <SkeletonCard key={n} />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="catalog-section">
        <div className="state-card error-card">
          <div className="state-icon">⚠️</div>
          <h3 className="state-title">Catalog Unavailable</h3>
          <p className="state-description">{error}</p>
          <button
            type="button"
            className="primary-button"
            onClick={() => window.location.reload()}
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (sortedList.length === 0) {
    return (
      <div className="catalog-section">
        <div className="state-card empty-card">
          <div className="state-icon">🔍</div>
          <h3 className="state-title">No Books Found</h3>
          <p className="state-description">
            {search || genreId
              ? 'No books match the current search or genre filter.'
              : 'There are no books currently listed.'}
          </p>
          {(search || genreId) && onReset && (
            <button
              type="button"
              className="secondary-button"
              onClick={onReset}
            >
              Clear Filters
            </button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="catalog-section">
      <div className="catalog-header-info">
        <p className="catalog-count">
          Showing <strong>{sortedList.length}</strong> {sortedList.length === 1 ? 'book' : 'books'}
          {search && <span> matching &ldquo;{search}&rdquo;</span>}
        </p>
      </div>

      <div className="book-grid">
        {sortedList.map((book) => (
          <BookCard key={book.id} book={book} />
        ))}
      </div>
    </div>
  );
}
