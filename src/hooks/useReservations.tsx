// hooks/useReservations.ts
import { useState, useEffect } from 'react';

interface Reservation {
  name: string;
  startTime: string;
  endTime: string;
  topic: string;
}

const useReservations = () => {
  const [reservations, setReservations] = useState<Reservation[]>(() => {
    const storedReservations = localStorage.getItem('reservations');
    return storedReservations ? JSON.parse(storedReservations) : [];
  });

  useEffect(() => {
    console.log('Loading reservations from local storage...');
    const savedReservations = localStorage.getItem('reservations');
    if (savedReservations) {
      try {
        const parsedReservations = JSON.parse(savedReservations);
        if (Array.isArray(parsedReservations)) {
            console.log('Parsed reservations:', parsedReservations);
          setReservations(parsedReservations);
        } else {
          console.error('Invalid data structure in localStorage for reservations');
        }
      } catch (error) {
        console.error('Error parsing reservations from localStorage', error);
      }
    }
  }, []);

  useEffect(() => {
    console.log('Updating localStorage with reservations:', reservations);
    localStorage.setItem('reservations', JSON.stringify(reservations));
  }, [reservations]);

  return { reservations, setReservations };
};

export default useReservations;