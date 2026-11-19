import { useState, useEffect } from 'react';
import SearchBar from '../components/SearchBar';
import BookGrid from '../components/BookGrid';
import { API_URL } from '../config/api';

export default function HomePage() {
  const [genreId, setGenreId] = useState('');
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState('default');
  const [genres, setGenres] = useState([]);

  useEffect(() => {
    fetch(`${API_URL}/genres`)
      .then((res) => (res.ok ? res.json() : []))
      .then((data) => {
        setGenres(Array.isArray(data) ? data : data.data || []);
      })
      .catch((err) => {
        console.error('Failed to load genres:', err);
      });
  }, []);

  const handleReset = () => {
    setGenreId('');
    setSearch('');
    setSortBy('default');
  };

  return (
    <div className="home-page">
      <section className="catalog-hero">
        <div className="hero-content">
          <span className="hero-badge">Patron Catalog</span>
          <h1 className="hero-title">Library Book Collection</h1>
          <p className="hero-subtitle">
            Browse our books, filter by genre, and search titles and authors.
          </p>
        </div>
      </section>

      <section className="filters-toolbar">
        <div className="toolbar-search-col">
          <SearchBar onSearch={setSearch} />
        </div>

        <div className="toolbar-controls-col">
          <div className="filter-group">
            <label htmlFor="genre-filter" className="filter-label">
              Genre:
            </label>
            <select
              id="genre-filter"
              className="filter-select"
              value={genreId}
              onChange={(e) => setGenreId(e.target.value)}
            >
              <option value="">All Genres</option>
              {genres.map((g) => (
                <option key={g.id} value={g.id}>
                  {g.name}
                </option>
              ))}
            </select>
          </div>

          <div className="filter-group">
            <label htmlFor="sort-select" className="filter-label">
              Sort:
            </label>
            <select
              id="sort-select"
              className="filter-select"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option value="default">Default</option>
              <option value="title-asc">Title: A-Z</option>
              <option value="title-desc">Title: Z-A</option>
              <option value="author-asc">Author: A-Z</option>
              <option value="author-desc">Author: Z-A</option>
            </select>
          </div>

          {(genreId || search || sortBy !== 'default') && (
            <button
              type="button"
              className="reset-pill-btn"
              onClick={handleReset}
            >
              Reset ↺
            </button>
          )}
        </div>
      </section>

      <BookGrid
        genreId={genreId}
        search={search}
        sortBy={sortBy}
        onReset={handleReset}
      />
    </div>
  );
}
