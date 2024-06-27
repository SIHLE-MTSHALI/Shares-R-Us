import React from 'react';
import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../redux/reducers/authReducer';

const Layout = ({ children }) => {
  const { isAuthenticated, user } = useSelector(state => state.auth);
  const dispatch = useDispatch();

  const handleLogout = () => {
    dispatch(logout());
  };

  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-primary text-white p-4">
        <div className="container mx-auto flex justify-between items-center">
          <Link to="/" className="text-2xl font-bold">Shares'R'Us</Link>
          <nav>
            {isAuthenticated ? (
              <>
                <span className="mr-4">Welcome, {user.email}</span>
                <button onClick={handleLogout} className="bg-accent px-4 py-2 rounded">Logout</button>
              </>
            ) : (
              <>
                <Link to="/login" className="mr-4">Login</Link>
                <Link to="/register" className="bg-accent px-4 py-2 rounded">Register</Link>
              </>
            )}
          </nav>
        </div>
      </header>
      <main className="flex-grow container mx-auto p-4">
        {children}
      </main>
      <footer className="bg-primary text-white p-4">
        <div className="container mx-auto text-center">
          © 2024 Shares'R'Us. All rights reserved.
        </div>
      </footer>
    </div>
  );
};

export default Layout;