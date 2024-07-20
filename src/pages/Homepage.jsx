import React from 'react';
import { Link } from 'react-router-dom';

function HomePage() {
  return (
    <div className="max-w-md mx-auto text-center p-6 bg-white rounded-lg shadow-lg">
      <h1 className="text-3xl font-bold mb-8">Passenger Loading System</h1>
      <div className="space-y-4">
        <Link
          to="/book"
          className="block w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-4 rounded-md transition duration-300"
        >
          Book a Car
        </Link>
        <Link
          to="/check-reservation"
          className="block w-full bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-4 rounded-md transition duration-300"
        >
          Check My Reservation
        </Link>
      </div>
    </div>
  );
}

export default HomePage;