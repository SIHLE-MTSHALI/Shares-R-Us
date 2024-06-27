import React, { useState } from 'react';

const SearchFilter = ({ onSearch, onFilter }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('all');

  const handleSearch = (e) => {
    e.preventDefault();
    onSearch(searchTerm);
  };

  const handleFilterChange = (e) => {
    const newFilter = e.target.value;
    setFilter(newFilter);
    onFilter(newFilter);
  };

  return (
    <div className="mb-6">
      <form onSubmit={handleSearch} className="flex mb-4">
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search assets..."
          className="flex-grow px-4 py-2 border rounded-l-md"
        />
        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded-r-md">
          Search
        </button>
      </form>
      <select
        value={filter}
        onChange={handleFilterChange}
        className="w-full px-4 py-2 border rounded-md"
      >
        <option value="all">All Assets</option>
        <option value="stocks">Stocks Only</option>
        <option value="crypto">Cryptocurrencies Only</option>
      </select>
    </div>
  );
};

export default SearchFilter;