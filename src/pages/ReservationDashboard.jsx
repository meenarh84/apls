import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { firestore } from '../utils/firebase';
import { calculateCountdown, cars } from '../utils/bookingUtils';

function ReservationDashboard() {
  const { ticketNumber } = useParams();
  const [booking, setBooking] = useState(null);
  const [countdown, setCountdown] = useState('');
  const [error, setError] = useState('');
  const [remainingPassengers, setRemainingPassengers] = useState(0);
  const [userStats, setUserStats] = useState({ totalTrips: 0, favoriteDestination: '' });

  useEffect(() => {
    const fetchBooking = async () => {
      try {
        const bookingDoc = await firestore.collection('bookings').doc(ticketNumber).get();

        if (bookingDoc.exists) {
          const bookingData = bookingDoc.data();
          setBooking(bookingData);
          const car = cars.find(c => c.id === bookingData.carId);
          const bookingsInCar = await firestore.collection('bookings')
            .where('carId', '==', bookingData.carId)
            .where('boardingSlot', '==', bookingData.boardingSlot)
            .get();
          setRemainingPassengers(car.capacity - bookingsInCar.size);

          // Fetch user statistics
          const userBookings = await firestore.collection('bookings')
            .where('matricNumber', '==', bookingData.matricNumber)
            .get();
          
          const totalTrips = userBookings.size;
          const destinations = userBookings.docs.map(doc => doc.data().destination);
          const favoriteDestination = destinations.sort((a,b) =>
            destinations.filter(v => v===a).length - destinations.filter(v => v===b).length
          ).pop();

          setUserStats({ totalTrips, favoriteDestination });
        } else {
          setError('No booking found for this ticket number.');
        }
      } catch (error) {
        console.error('Error fetching booking:', error);
        setError('Failed to fetch booking details.');
      }
    };

    fetchBooking();
  }, [ticketNumber]);

  useEffect(() => {
    if (booking) {
      const timer = setInterval(() => {
        const timeLeft = calculateCountdown(booking.boardingSlot);
        setCountdown(timeLeft);
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [booking]);

  if (error) {
    return (
      <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-lg">
        <p className="text-red-500 mb-4">{error}</p>
        <Link to="/" className="text-blue-500 hover:underline">
          Go back to homepage
        </Link>
      </div>
    );
  }

  if (!booking) {
    return <div className="text-center">Loading...</div>;
  }

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-3xl font-bold mb-6 text-center">Reservation Dashboard</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-gray-100 p-4 rounded-lg">
          <h3 className="text-xl font-semibold mb-4">Booking Details</h3>
          <p><strong>Ticket Number:</strong> {booking.ticketNumber}</p>
          <p><strong>Matriculation Number:</strong> {booking.matricNumber}</p>
          <p><strong>Boarding Slot:</strong> {booking.boardingSlot}</p>
          <p><strong>Destination:</strong> {booking.destination}</p>
          <p><strong>Car Number:</strong> {booking.carId}</p>
          <p><strong>Seat Number:</strong> {booking.seatNumber}</p>
        </div>
        <div className="bg-gray-100 p-4 rounded-lg">
          <h3 className="text-xl font-semibold mb-4">Departure Information</h3>
          <p><strong>Time until departure:</strong></p>
          <p className="text-4xl font-bold text-blue-600">{countdown}</p>
          <p className="mt-4"><strong>Remaining seats in car:</strong> {remainingPassengers}</p>
        </div>
        <div className="bg-gray-100 p-4 rounded-lg">
          <h3 className="text-xl font-semibold mb-4">Car Information</h3>
          <p><strong>Car Model:</strong> {cars.find(c => c.id === booking.carId)?.model || 'N/A'}</p>
          <p><strong>Car Capacity:</strong> {cars.find(c => c.id === booking.carId)?.capacity || 'N/A'}</p>
        </div>
        <div className="bg-gray-100 p-4 rounded-lg">
          <h3 className="text-xl font-semibold mb-4">User Statistics</h3>
          <p><strong>Total Trips:</strong> {userStats.totalTrips}</p>
          <p><strong>Favorite Destination:</strong> {userStats.favoriteDestination}</p>
        </div>
      </div>
      <div className="mt-8 text-center">
        <Link to="/" className="text-blue-500 hover:underline">
          Go back to homepage
        </Link>
      </div>
    </div>
  );
}

export default ReservationDashboard;