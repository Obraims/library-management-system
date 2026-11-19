import { Routes, Route, Link } from 'react-router-dom';
import HomePage from './pages/HomePage';
import BookDetail from './pages/BookDetail';

export default function App() {
  return (
    <div className="app-shell">
      <header className="site-header">
        <div className="header-container">
          <Link to="/" className="site-brand">
            <span className="brand-logo" aria-hidden="true">📖</span>
            <div className="brand-text">
              <span className="brand-title">Athenaeum</span>
              <span className="brand-tagline">Patron Library Catalog</span>
            </div>
          </Link>
          <nav className="site-nav">
            <Link to="/" className="nav-link">
              Browse Catalog
            </Link>
          </nav>
        </div>
      </header>

      <main className="site-main">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/books/:id" element={<BookDetail />} />
        </Routes>
      </main>

      <footer className="site-footer">
        <div className="footer-container">
          <p>© {new Date().getFullYear()} Athenaeum Library System. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
