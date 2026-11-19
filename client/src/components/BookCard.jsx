import { useState } from 'react';
import { Link } from 'react-router-dom';

export default function BookCard({ book }) {
  const [imageFailed, setImageFailed] = useState(false);

  if (!book) return null;

  const isAvailable = (book.availableCopies ?? 1) > 0;
  const genreName = book.genre?.name || 'General';

  return (
    <div className="book-card">
      <Link to={`/books/${book.id}`} className="book-card-link">
        <div className="book-card-cover-wrapper">
          {book.coverImage && !imageFailed ? (
            <img
              src={book.coverImage}
              alt={book.title}
              className="book-card-cover"
              onError={() => setImageFailed(true)}
            />
          ) : (
            <div className={`book-card-cover-fallback genre-${book.genre?.slug || 'default'}`}>
              <span className="fallback-genre-pill">{genreName}</span>
              <div className="fallback-text">
                <h4 className="fallback-title">{book.title}</h4>
                <p className="fallback-author">{book.author}</p>
              </div>
              <span className="fallback-book-icon">📖</span>
            </div>
          )}

          <span className={`availability-badge ${isAvailable ? 'badge-available' : 'badge-unavailable'}`}>
            {isAvailable ? `${book.availableCopies} available` : 'Checked Out'}
          </span>
        </div>

        <div className="book-card-body">
          <div className="book-card-meta">
            <span className="genre-tag">{genreName}</span>
          </div>
          <h3 className="book-card-title">{book.title}</h3>
          <p className="book-card-author">by {book.author}</p>
        </div>

        <div className="book-card-footer">
          <span className="view-details-text">View details →</span>
          <span className="copies-status">
            {book.availableCopies ?? 0}/{book.totalCopies ?? 1} copies
          </span>
        </div>
      </Link>
    </div>
  );
}
