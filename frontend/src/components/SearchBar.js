import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const SearchBar = () => {
  const [query, setQuery] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (query.trim()) {
      navigate(`/search?q=${encodeURIComponent(query)}`);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex">
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search stocks or crypto..."
        className="flex-grow px-4 py-2 border rounded-l-md focus:outline-none focus:ring-2 focus:ring-accent"
      />
      <button
        type="submit"
        className="bg-accent text-white px-4 py-2 rounded-r-md hover:bg-opacity-90 transition-colors"
      >
        Search
      </button>
    </form>
  );
};

export default SearchBar;