import React from 'react';
import { Link } from 'react-router-dom';
import logo from '../logo.png'; 

const Header = () => {
  return (
    <header className="bg-primary text-white p-4 flex justify-between items-center">
      <Link to="/" className="text-xl font-bold">
        <img src={logo} alt="Shares'R'Us Logo" className="h-8 w-8 inline mr-2" />
        Shares'R'Us
      </Link>
      <nav>
        <Link to="/" className="mx-2">Home</Link>
        <Link to="/news" className="mx-2">News</Link>
        <Link to="/earnings" className="mx-2">Earnings</Link>
        <Link to="/portfolio" className="mx-2">Portfolio</Link>
      </nav>
      <div>
        <input type="text" placeholder="Search" className="p-1" />
        <button className="ml-2">Search</button>
        <Link to="/login" className="ml-4">Login</Link>
      </div>
    </header>
  );
};

export default Header;