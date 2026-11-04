import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useReadingList } from '../context/ReadingListContext';
import { useAuth } from '../context/AuthContext';
import { BookOpen, Bookmark, Calendar, LogIn, LogOut, UserPlus, User } from 'lucide-react';

export default function Navbar() {
  const { count } = useReadingList();
  const { user, token, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="bg-indigo-900 text-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <Link to="/" className="flex items-center space-x-2 text-xl font-bold tracking-tight">
            <BookOpen className="w-6 h-6 text-indigo-400" />
            <span>Library System</span>
          </Link>

          <div className="flex items-center space-x-6">
            <Link to="/" className="hover:text-indigo-200 transition-colors">
              Catalog
            </Link>

            <Link to="/reading-list" className="relative flex items-center space-x-1 hover:text-indigo-200 transition-colors">
              <Bookmark className="w-5 h-5" />
              <span>Reading List</span>
              {count > 0 && (
                <span className="ml-1 bg-amber-500 text-indigo-950 font-bold text-xs px-2 py-0.5 rounded-full">
                  {count}
                </span>
              )}
            </Link>

            <Link to="/book-space" className="flex items-center space-x-1 hover:text-indigo-200 transition-colors">
              <Calendar className="w-5 h-5" />
              <span>Book Space</span>
            </Link>

            {token ? (
              <div className="flex items-center space-x-4">
                <span className="flex items-center space-x-1 text-sm bg-indigo-800 px-3 py-1 rounded-full text-indigo-200">
                  <User className="w-4 h-4" />
                  <span>{user?.name || user?.email || 'Patron'}</span>
                </span>
                <button
                  onClick={handleLogout}
                  className="flex items-center space-x-1 text-sm bg-indigo-700 hover:bg-indigo-600 px-3 py-1.5 rounded-md transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Logout</span>
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <Link
                  to="/login"
                  className="flex items-center space-x-1 text-sm bg-indigo-800 hover:bg-indigo-700 px-3 py-1.5 rounded-md transition-colors"
                >
                  <LogIn className="w-4 h-4" />
                  <span>Login</span>
                </Link>
                <Link
                  to="/register"
                  className="flex items-center space-x-1 text-sm bg-amber-500 hover:bg-amber-400 text-indigo-950 font-semibold px-3 py-1.5 rounded-md transition-colors"
                >
                  <UserPlus className="w-4 h-4" />
                  <span>Register</span>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
