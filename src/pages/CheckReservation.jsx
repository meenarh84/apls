import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function CheckReservation() {
  const [ticketNumber, setTicketNumber] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    navigate(`/dashboard/${ticketNumber}`);
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-6 text-center">Check Reservation</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="ticketNumber" className="block font-medium mb-2">
            Ticket Number
          </label>
          <input
            type="text"
            id="ticketNumber"
            value={ticketNumber}
            onChange={(e) => setTicketNumber(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
        <button
          type="submit"
          className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded-md transition duration-300"
        >
          Check Reservation
        </button>
      </form>
    </div>
  );
}

export default CheckReservation;