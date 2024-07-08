import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-primary text-white p-4 mt-8">
      <div className="flex justify-between items-center">
        <div className="quick-links">
          <ul className="flex space-x-4">
            <li><a href="/about">About</a></li>
            <li><a href="/contact">Contact</a></li>
            <li><a href="/terms">Terms of Use</a></li>
            <li><a href="/privacy">Privacy Policy</a></li>
          </ul>
        </div>
        <div className="social-media">
          <ul className="flex space-x-4">
            <li><a href="https://twitter.com">Twitter</a></li>
            <li><a href="https://facebook.com">Facebook</a></li>
            <li><a href="https://linkedin.com">LinkedIn</a></li>
          </ul>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
