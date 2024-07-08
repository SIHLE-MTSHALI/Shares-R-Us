import React from 'react';
import { Link } from 'react-router-dom';

const Header = () => {
  return (
    <header className="bg-primary text-white p-4 flex justify-between items-center">
      <div className="logo">
        <Link to="/">
          <h1 className="text-2xl">Shares'R'Us</h1>
        </Link>
      </div>
      <nav>
        <ul className="flex space-x-4">
          <li><Link to="/">Home</Link></li>
          <li><Link to="/news">News</Link></li>
          <li><Link to="/earnings">Earnings</Link></li>
          <li><Link to="/portfolio">Portfolio</Link></li>
        </ul>
      </nav>
      <div className="user-account">
        <Link to="/profile">Profile</Link>
      </div>
    </header>
  );
};

export default Header;
