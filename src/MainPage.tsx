import React, { useState, useEffect, useMemo } from "react";
import "./MainPage.css";
import { useNavigate } from "react-router-dom";
import useReservations from "./hooks/useReservations";
import useRandomAnimal from "./hooks/useRandomAnimal";
import useRemoveExpiredReservations from "./hooks/useRemoveExpiredReservations";
import DateTime from "./currentTime";
const MainPage: React.FC = () => {
  const navigate = useNavigate();
  const { reservations, setReservations } = useReservations();
  const reservedAnimals = reservations.map((reservation) => reservation.name);
  const { animal: randomAnimal, setNewRandomAnimal } =
    useRandomAnimal(reservedAnimals);
  useRemoveExpiredReservations(reservations, setReservations);

  const [circleColor, setCircleColor] = useState("green");
  const [countdown, setCountdown] = useState<number | null>(null);

  const convertTimeToNumber = useMemo(
    () => (time: string) => parseInt(time.replace(":", ""), 10),
    []
  );

  const sortedReservations = [...reservations].sort(
    (a, b) =>
      convertTimeToNumber(a.startTime) - convertTimeToNumber(b.startTime)
  );

  const getOngoingReservation = () => {
    const now = new Date();
    return reservations.find((reservation) => {
      const reservationStartDate = new Date(
        `${now.toDateString()} ${reservation.startTime}`
      );
      const reservationEndDate = new Date(
        `${now.toDateString()} ${reservation.endTime}`
      );
      return now >= reservationStartDate && now <= reservationEndDate;
    });
  };

  const ongoingReservation = getOngoingReservation();

  useEffect(() => {
    const now = new Date();
    const hasOngoingReservation = reservations.some((reservation) => {
      const reservationStartDate = new Date(
        `${now.toDateString()} ${reservation.startTime}`
      );
      const reservationEndDate = new Date(
        `${now.toDateString()} ${reservation.endTime}`
      );
      return now >= reservationStartDate && now <= reservationEndDate;
    });
    setCircleColor(hasOngoingReservation ? "red" : "green");
  }, [reservations]);

  useEffect(() => {
    const updateCountdown = () => {
      const now = new Date();
      const ongoingReservation = reservations.find((reservation) => {
        const reservationStartDate = new Date(
          `${now.toDateString()} ${reservation.startTime}`
        );
        const reservationEndDate = new Date(
          `${now.toDateString()} ${reservation.endTime}`
        );
        return now >= reservationStartDate && now <= reservationEndDate;
      });

      if (ongoingReservation) {
        const reservationEndDate = new Date(
          `${now.toDateString()} ${ongoingReservation.endTime}`
        );
        const timeDiff = reservationEndDate.getTime() - now.getTime();
        if (timeDiff > 0) {
          const minutes = Math.floor(timeDiff / 60000);
          const seconds = Math.floor((timeDiff % 60000) / 1000);
          setCountdown(minutes * 60 + seconds);
        } else {
          setCountdown(null);
        }
      } else {
        setCountdown(null);
      }
    };

    updateCountdown();
    const intervalId = setInterval(updateCountdown, 1000);
    return () => clearInterval(intervalId);
  }, [reservations]);

  const handleButtonClick = () => navigate("/roomReservation");

  const saveReservationsToLocalStorage = (reservations: any) => {
    localStorage.setItem("reservations", JSON.stringify(reservations));
  };

  const handleQuickReserve = (minutes: number) => {
    const now = new Date();
    const startTime = new Date(now.getTime());
    const endTime = new Date(now.getTime() + minutes * 60000);

    const startTimeStr = startTime.toTimeString().substring(0, 5);
    const endTimeStr = endTime.toTimeString().substring(0, 5);

    const newReservation = {
      name: randomAnimal,
      startTime: startTimeStr,
      endTime: endTimeStr,
      topic: "",
    };

    const startDate = new Date(`${now.toDateString()} ${startTimeStr}`);
    const endDate = new Date(`${now.toDateString()} ${endTimeStr}`);

    const isOverlapping = reservations.some((reservation) => {
      const reservationStartDate = new Date(
        `${now.toDateString()} ${reservation.startTime}`
      );
      const reservationEndDate = new Date(
        `${now.toDateString()} ${reservation.endTime}`
      );
      return startDate < reservationEndDate && endDate > reservationStartDate;
    });

    if (isOverlapping) {
      alert(
        "This reservation conflicts with an existing reservation. Please choose another time."
      );
      return;
    }

    const updatedReservations = [...reservations, newReservation];
    setReservations(updatedReservations);
    saveReservationsToLocalStorage(updatedReservations);
    setNewRandomAnimal();
  };

  useEffect(() => {
    try {
      const storedReservations = localStorage.getItem("reservations");
      if (storedReservations) {
        setReservations(JSON.parse(storedReservations));
      }
    } catch (error) {
      console.error("Failed to parse reservations from local storage", error);
    }
  }, [setReservations]);

  const futureReservations = sortedReservations.filter((reservation) => {
    const now = new Date();
    const reservationStartDate = new Date(
      `${now.toDateString()} ${reservation.startTime}`
    );
    return reservationStartDate > now;
  });

  const handleStopReservation = () => {
    if (ongoingReservation) {
      const updatedReservations = reservations.filter(
        (reservation) => reservation !== ongoingReservation
      );
      setReservations(updatedReservations);
      saveReservationsToLocalStorage(updatedReservations);
      setCountdown(null); // Clear the countdown when reservation is stopped
    }
  };

  return (
    <div className="container">
      <div className="header">
        <div className="time">{DateTime()}</div>
        <div className="logo1">
          <img
            className="logo"
            src="https://lut.pictures.fi/kuvat/LAB%20Press%20Images/LOGOS/LOGO%20FOR%20DISPLAYS/02%20LAB%20ENG%20WHITE.png?img=img2048"
            alt="LAB Logo"
          />
        </div>
      </div>
      <div className="content">
        <div className="room-info">
          <button onClick={handleButtonClick} className="reserve-button">
            Reserve
          </button>
          <h1 className="classroom">
            Room A
            <span className="people-count">
              4
              <svg
                className="icon"
                xmlns="http://www.w3.org/2000/svg"
                height="48px"
                viewBox="0 -960 960 960"
                width="48px"
                fill="#ffffff"
              >
                <path d="M0-240v-63q0-43 44-70t116-27q13 0 25 .5t23 2.5q-14 21-21 44t-7 48v65H0Zm240 0v-65q0-32 17.5-58.5T307-410q32-20 76.5-30t96.5-10q53 0 97.5 10t76.5 30q32 20 49 46.5t17 58.5v65H240Zm540 0v-65q0-26-6.5-49T754-397q11-2 22.5-2.5t23.5-.5q72 0 116 26.5t44 70.5v63H780Zm-455-80h311q-10-20-55.5-35T480-370q-55 0-100.5 15T325-320ZM160-440q-33 0-56.5-23.5T80-520q0-34 23.5-57t56.5-23q34 0 57 23t23 57q0 33-23 56.5T160-440Zm640 0q-33 0-56.5-23.5T720-520q0-34 23.5-57t56.5-23q34 0 57 23t23 57q0 33-23 56.5T800-440Zm-320-40q-50 0-85-35t-35-85q0-51 35-85.5t85-34.5q51 0 85.5 34.5T600-600q0 50-34.5 85T480-480Zm0-80q17 0 28.5-11.5T520-600q0-17-11.5-28.5T480-640q-17 0-28.5 11.5T440-600q0 17 11.5 28.5T480-560Zm1 240Zm-1-280Z" />
              </svg>
            </span>
          </h1>
          {ongoingReservation ? (
            <div className="next-reservation">
              <h2>{ongoingReservation.name}</h2>
              <h2>
                Klo. {ongoingReservation.startTime}-{ongoingReservation.endTime}
              </h2>
              {ongoingReservation.topic && (
                <h2>{"Topic: " + ongoingReservation.topic}</h2>
              )}
            </div>
          ) : (
            <div className="next-reservation">
              <h2>Available</h2>
            </div>
          )}
        </div>
        <div className="status">
          {!ongoingReservation && (
            <div className="quick-reserve-buttons">
              <button onClick={() => handleQuickReserve(15)}>15min</button>
              <button onClick={() => handleQuickReserve(30)}>30min</button>
              <button onClick={() => handleQuickReserve(45)}>45min</button>
            </div>
          )}
          <div
            className={`status-circle ${circleColor}`}
            onClick={handleStopReservation}
          >
            {ongoingReservation
              ? "Stop"
              : circleColor === "red"
              ? "Reserved"
              : "Available"}
            {ongoingReservation && countdown !== null && (
              <div className="countdown">
                {Math.floor(countdown / 60)}:
                {countdown % 60 < 10 ? `0${countdown % 60}` : countdown % 60}
              </div>
            )}
          </div>
        </div>
        <div className="right-panel">
          <h1>Next reservations</h1>
          <div className="timetable">
            {futureReservations.map((reservation, index) => (
              <div key={index} className="timetable-entry">
                <p>{reservation.name}</p>
                <p>
                  Klo. {reservation.startTime}-{reservation.endTime}
                </p>
                {reservation.topic && <p>{"Topic: " + reservation.topic}</p>}
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="footer">
        <div className="schedule-button">Photo: City of Lappeenranta</div>
        <div className="settings-button">Change Photo</div>
      </div>
    </div>
  );
};

export default MainPage;
