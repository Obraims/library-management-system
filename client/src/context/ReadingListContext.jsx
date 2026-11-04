import React, { createContext, useContext, useReducer, useEffect } from 'react';

const ReadingListContext = createContext();

const STORAGE_KEY = 'lms_reading_list';

const initialState = {
  items: JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]')
};

function readingListReducer(state, action) {
  switch (action.type) {
    case 'ADD_BOOK': {
      const exists = state.items.some(item => item.id === action.payload.id);
      if (exists) return state;
      const updated = [...state.items, action.payload];
      return { ...state, items: updated };
    }
    case 'REMOVE_BOOK': {
      const updated = state.items.filter(item => item.id !== action.payload);
      return { ...state, items: updated };
    }
    case 'CLEAR_LIST': {
      return { ...state, items: [] };
    }
    case 'SET_LIST': {
      return { ...state, items: action.payload };
    }
    default:
      return state;
  }
}

export function ReadingListProvider({ children }) {
  const [state, dispatch] = useReducer(readingListReducer, initialState);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state.items));
  }, [state.items]);

  const addBook = (book) => dispatch({ type: 'ADD_BOOK', payload: book });
  const removeBook = (id) => dispatch({ type: 'REMOVE_BOOK', payload: id });
  const clearList = () => dispatch({ type: 'CLEAR_LIST' });

  const value = {
    items: state.items,
    count: state.items.length,
    addBook,
    removeBook,
    clearList,
    dispatch
  };

  return (
    <ReadingListContext.Provider value={value}>
      {children}
    </ReadingListContext.Provider>
  );
}

export function useReadingList() {
  const context = useContext(ReadingListContext);
  if (!context) {
    throw new Error('useReadingList must be used within a ReadingListProvider');
  }
  return context;
}

export default ReadingListContext;
