import React from 'react';
import { Link } from 'react-router-dom';

export default function Navbar() {
  return (
    <nav className="bg-white shadow mb-6">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <Link to="/" className="font-bold text-xl text-indigo-600">
          E-Commerce
        </Link>
        <div>
          <Link to="/cart" className="mr-4 hover:text-indigo-700">
            Cart
          </Link>
          <Link to="/orders" className="hover:text-indigo-700">
            Orders
          </Link>
        </div>
      </div>
    </nav>
  );
}
