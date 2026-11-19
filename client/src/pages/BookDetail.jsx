import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { API_URL } from '../config/api';

export default function BookDetail() {
  const { id } = useParams();
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [imageFailed, setImageFailed] = useState(false);

  useEffect(() => {
    let active = true;
    setLoading(true);
    setError(null);

    fetch(`${API_URL}/books/${id}`)
      .then((res) => {
        if (!res.ok) {
          throw new Error(res.status === 404 ? 'Book not found' : 'Failed to fetch book');
        }
        return res.json();
      })
      .then((data) => {
        if (!active) return;
        setBook(data);
        setLoading(false);
      })
      .catch((err) => {
        if (!active) return;
        setError(err.message);
        setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [id]);

  if (loading) {
    return (
      <div className="book-detail-page">
        <div className="back-nav">
          <Link to="/" className="back-link">
            ← Back to Catalog
          </Link>
        </div>

        <div className="book-detail-card skeleton-detail">
          <div className="detail-cover-skeleton shimmer" />
          <div className="detail-content-skeleton">
            <div className="skeleton-line skeleton-tag shimmer" />
            <div className="skeleton-line skeleton-title-lg shimmer" />
            <div className="skeleton-line skeleton-author-lg shimmer" />
            <div className="skeleton-line skeleton-desc shimmer" />
            <div className="skeleton-line skeleton-desc shimmer" />
          </div>
        </div>
      </div>
    );
  }

  if (error || !book) {
    return (
      <div className="book-detail-page">
        <div className="back-nav">
          <Link to="/" className="back-link">
            ← Back to Catalog
          </Link>
        </div>

        <div className="state-card error-card">
          <div className="state-icon">⚠️</div>
          <h2 className="state-title">Book Not Found</h2>
          <p className="state-description">{error || 'Unable to load book details.'}</p>
          <Link to="/" className="primary-button">
            Back to Catalog
          </Link>
        </div>
      </div>
    );
  }

  const isAvailable = (book.availableCopies ?? 1) > 0;
  const genreName = book.genre?.name || 'General';
  const reviews = book.reviews || [];

  return (
    <div className="book-detail-page">
      <div className="back-nav">
        <Link to="/" className="back-link">
          ← Back to Catalog
        </Link>
      </div>

      <div className="book-detail-card">
        <div className="detail-cover-wrapper">
          {book.coverImage && !imageFailed ? (
            <img
              src={book.coverImage}
              alt={book.title}
              className="detail-cover-image"
              onError={() => setImageFailed(true)}
            />
          ) : (
            <div className={`detail-cover-fallback genre-${book.genre?.slug || 'default'}`}>
              <span className="fallback-genre-pill">{genreName}</span>
              <div className="fallback-text">
                <h3 className="fallback-title">{book.title}</h3>
                <p className="fallback-author">{book.author}</p>
              </div>
              <span className="fallback-book-icon">📖</span>
            </div>
          )}

          <div className="detail-actions">
            <button
              type="button"
              className={`primary-button borrow-button ${!isAvailable ? 'disabled' : ''}`}
              disabled={!isAvailable}
            >
              {isAvailable ? 'Borrow Book' : 'Currently Unavailable'}
            </button>
          </div>
        </div>

        <div className="detail-content">
          <div className="detail-header">
            <div className="genre-pill-wrapper">
              <span className="genre-tag large">{genreName}</span>
              <span className={`availability-badge ${isAvailable ? 'badge-available' : 'badge-unavailable'}`}>
                {isAvailable ? 'In Stock' : 'Checked Out'}
              </span>
            </div>

            <h1 className="detail-title">{book.title}</h1>
            <p className="detail-author">by <strong>{book.author}</strong></p>
          </div>

          <div className="detail-availability-bar">
            <div className="availability-metric">
              <span className="metric-label">Copies</span>
              <span className="metric-value">
                <strong>{book.availableCopies ?? 0}</strong> of {book.totalCopies ?? 1} available
              </span>
            </div>
            <div className="metric-progress-track">
              <div
                className="metric-progress-fill"
                style={{
                  width: `${book.totalCopies ? ((book.availableCopies ?? 0) / book.totalCopies) * 100 : 0}%`,
                }}
              />
            </div>
          </div>

          <div className="detail-metadata-grid">
            <div className="meta-item">
              <span className="meta-label">ISBN</span>
              <span className="meta-value"><code>{book.isbn}</code></span>
            </div>
            <div className="meta-item">
              <span className="meta-label">ID</span>
              <span className="meta-value">#{book.id}</span>
            </div>
            <div className="meta-item">
              <span className="meta-label">Category</span>
              <span className="meta-value">{genreName}</span>
            </div>
            {book.publishedYr && (
              <div className="meta-item">
                <span className="meta-label">Year</span>
                <span className="meta-value">{book.publishedYr}</span>
              </div>
            )}
          </div>

          {book.description && (
            <div className="detail-description-section">
              <h2 className="section-heading">Description</h2>
              <p className="detail-description">{book.description}</p>
            </div>
          )}

          <div className="detail-reviews-section">
            <h2 className="section-heading">
              Reviews {reviews.length > 0 && `(${reviews.length})`}
            </h2>

            {reviews.length === 0 ? (
              <p className="no-reviews-note">No reviews yet for this book.</p>
            ) : (
              <div className="reviews-list">
                {reviews.map((rev) => (
                  <div key={rev.id} className="review-card">
                    <div className="review-header">
                      <div className="review-rating">
                        {'★'.repeat(rev.rating)}{'☆'.repeat(Math.max(0, 5 - rev.rating))}
                      </div>
                    </div>
                    {rev.comment && <p className="review-comment">&ldquo;{rev.comment}&rdquo;</p>}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
