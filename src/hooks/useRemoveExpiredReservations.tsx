// hooks/useRemoveExpiredReservations.ts
import { useEffect } from 'react';

interface Reservation {
    name: string;
    startTime: string;
    endTime: string;
    topic: string;
  }

const useRemoveExpiredReservations = (  reservations: Reservation[], 
    setReservations: React.Dispatch<React.SetStateAction<Reservation[]>>) => {
  const removeExpiredReservations = () => {
    const now = new Date();
    const currentTime = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;

    const updatedReservations = reservations.filter((reservation) => reservation.endTime > currentTime);
    setReservations(updatedReservations);
  };

  useEffect(() => {
    const interval = setInterval(removeExpiredReservations, 60000);
    return () => clearInterval(interval);
  }, [reservations]);

  return { removeExpiredReservations };
};

export default useRemoveExpiredReservations;