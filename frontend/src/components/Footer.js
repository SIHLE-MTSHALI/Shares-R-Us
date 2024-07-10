import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-primary text-white p-4 mt-8">
      <div className="flex justify-between">
        <div>
          <h3 className="font-bold">Quick Links</h3>
          <ul>
            <li><a href="/about">About</a></li>
            <li><a href="/contact">Contact</a></li>
            <li><a href="/terms">Terms of Use</a></li>
            <li><a href="/privacy">Privacy Policy</a></li>
          </ul>
        </div>
        <div>
          <h3 className="font-bold">Follow Us</h3>
          <div>
            <a href="https://twitter.com" className="mx-2">Twitter</a>
            <a href="https://facebook.com" className="mx-2">Facebook</a>
            <a href="https://linkedin.com" className="mx-2">LinkedIn</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
