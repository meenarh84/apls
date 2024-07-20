import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { firestore } from '../utils/firebase';
import { boardingSlots, assignCarSeat, generateTicketNumber } from '../utils/bookingUtils';

const destinations = [
  "P-Site to Take-off",
  "Take-off to Hostel",
  "Hostel to Take-off",
  "Hostel to P-Site"
];

function BookingForm() {
  const [matricNumber, setMatricNumber] = useState('');
  const [email, setEmail] = useState('');
  const [selectedSlot, setSelectedSlot] = useState('');
  const [selectedDestination, setSelectedDestination] = useState('');
  const [error, setError] = useState('');
  const [ticketNumber, setTicketNumber] = useState('');
  const [bookingComplete, setBookingComplete] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const newTicketNumber = generateTicketNumber();
      const assignedSeat = await assignCarSeat(selectedSlot);
      
      await firestore.collection('bookings').doc(newTicketNumber).set({
        ticketNumber: newTicketNumber,
        matricNumber,
        email,
        boardingSlot: selectedSlot,
        destination: selectedDestination,
        carId: assignedSeat.carId,
        seatNumber: assignedSeat.seatNumber,
        bookingTime: new Date()
      });

      setTicketNumber(newTicketNumber);
      setBookingComplete(true);
      // Here you would call a function to send an email with the ticket details
      // sendTicketEmail(email, newTicketNumber, selectedSlot, assignedSeat, selectedDestination);
    } catch (error) {
      console.error('Error booking car:', error);
      setError('Failed to book car. Please try again.');
    }
  };

  const handleViewDashboard = () => {
    navigate(`/dashboard/${ticketNumber}`);
  };

  if (bookingComplete) {
    return (
      <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold mb-6 text-center">Booking Successful!</h2>
        <p className="mb-4">Your ticket number is: <strong>{ticketNumber}</strong></p>
        <p className="mb-4">Please save this number as you'll need it to access your reservation details.</p>
        <p className="mb-4">A confirmation email has been sent to {email}.</p>
        <button
          onClick={handleViewDashboard}
          className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-md transition duration-300 mb-4"
        >
          View Reservation Details
        </button>
        <button
          onClick={() => navigate('/')}
          className="w-full bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded-md transition duration-300"
        >
          Return to Home
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-6 text-center">Book a Car</h2>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="matricNumber" className="block font-medium mb-2">
            Matriculation Number
          </label>
          <input
            type="text"
            id="matricNumber"
            value={matricNumber}
            onChange={(e) => setMatricNumber(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
        <div>
          <label htmlFor="email" className="block font-medium mb-2">
            Email
          </label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
        <div>
          <label htmlFor="boardingSlot" className="block font-medium mb-2">
            Boarding Slot
          </label>
          <select
            id="boardingSlot"
            value={selectedSlot}
            onChange={(e) => setSelectedSlot(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          >
            <option value="">Select a boarding slot</option>
            {boardingSlots.map((slot) => (
              <option key={slot.id} value={slot.time}>
                {slot.time}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="destination" className="block font-medium mb-2">
            Destination
          </label>
          <select
            id="destination"
            value={selectedDestination}
            onChange={(e) => setSelectedDestination(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          >
            <option value="">Select a destination</option>
            {destinations.map((dest, index) => (
              <option key={index} value={dest}>
                {dest}
              </option>
            ))}
          </select>
        </div>
        <button
          type="submit"
          className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-md transition duration-300"
        >
          Book Car
        </button>
      </form>
    </div>
  );
}

export default BookingForm;