import { firestore } from './firebase';

export const boardingSlots = [
  { id: 1, time: '8:00 AM' },
  { id: 2, time: '10:00 AM' },
  { id: 3, time: '12:00 PM' },
  { id: 4, time: '2:00 PM' },
  { id: 5, time: '4:00 PM' },
];

export async function assignCarSeat(boardingSlot) {
  const bookingsRef = firestore.collection('bookings');
  const existingBookings = await bookingsRef.where('boardingSlot', '==', boardingSlot).get();

  let availableCar = cars.find(car => 
    existingBookings.docs.filter(doc => doc.data().carId === car.id).length < car.capacity
  );

  if (!availableCar) {
    throw new Error('No available seats for this boarding slot');
  }

  const seatNumber = existingBookings.docs.filter(doc => doc.data().carId === availableCar.id).length + 1;

  return { carId: availableCar.id, seatNumber };
}

// ... other utility functions ...

export function calculateCountdown(boardingSlot) {
  const now = new Date();
  const [boardingHours, boardingMinutes] = boardingSlot.split(':');
  const boardingTime = new Date(now.getFullYear(), now.getMonth(), now.getDate(), parseInt(boardingHours), parseInt(boardingMinutes));

  if (boardingTime < now) {
    boardingTime.setDate(boardingTime.getDate() + 1);
  }

  const diff = boardingTime - now;
  const countdownHours = Math.floor(diff / 3600000);
  const countdownMinutes = Math.floor((diff % 3600000) / 60000);
  const countdownSeconds = Math.floor((diff % 60000) / 1000);

  return `${countdownHours.toString().padStart(2, '0')}:${countdownMinutes.toString().padStart(2, '0')}:${countdownSeconds.toString().padStart(2, '0')}`;
}

export const cars = [
  { id: 1, capacity: 100, model: "FUDMA001" },
  { id: 2, capacity: 100, model: "FUDMASCOS" },
  { id: 3, capacity: 30, model: "White Container" },
  { id: 4, capacity: 100, model: "Maryam Abacha" },
];
// ... other utility functions ...

export function generateTicketNumber() {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = '';
  for (let i = 0; i < 8; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
}