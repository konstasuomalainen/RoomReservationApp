// RoomReservation.js (or RoomReservation.tsx if using TypeScript)

import React, { useState } from "react";
import "./roomReservation.css";
import { DateTime } from "./currentTime";
import { useNavigate } from "react-router-dom";
import useReservations from "./hooks/useReservations";
import useRandomAnimal from "./hooks/useRandomAnimal";
import useRemoveExpiredReservations from "./hooks/useRemoveExpiredReservations";

const RoomReservation: React.FC = () => {
  const navigate = useNavigate();
  const [topic, setTopic] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [nameError, setNameError] = useState(false);
  const [startTimeError, setStartTimeError] = useState(false);
  const [endTimeError, setEndTimeError] = useState(false);

  const { reservations, setReservations } = useReservations();
  const reservedAnimals = reservations.map((reservation) => reservation.name);
  const { animal, setNewRandomAnimal } = useRandomAnimal(reservedAnimals);
  useRemoveExpiredReservations(reservations, setReservations);

  const handleButtonClick = () => {
    navigate("/");
    //localStorage.clear();
  };

  const handleTopicChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTopic(e.target.value);
  };

  const handleStartTimeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setStartTime(e.target.value);
    if (e.target.value) {
      setStartTimeError(false);
    }
  };

  const handleEndTimeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setEndTime(e.target.value);
    if (e.target.value) {
      setEndTimeError(false);
    }
  };

  const isTimeSlotAvailable = (start: string, end: string) => {
    return !reservations.some(
      (reservation: { startTime: string; endTime: string }) =>
        (start >= reservation.startTime && start < reservation.endTime) ||
        (end > reservation.startTime && end <= reservation.endTime) ||
        (start <= reservation.startTime && end >= reservation.endTime)
    );
  };

  const handleSubmit = () => {
    let hasError = false;

    if (animal === "" || startTime === "" || endTime === "") {
      if (animal === "") {
        setNameError(true);
      }
      if (startTime === "") {
        setStartTimeError(true);
      }
      if (endTime === "") {
        setEndTimeError(true);
      }
      hasError = true;
    }
    if (startTime >= endTime) {
      setStartTimeError(true);
      setEndTimeError(true);
      alert(
        "The start time cannot be the same as or later than the end time of the reservation."
      );
      hasError = true;
    }

    if (!isTimeSlotAvailable(startTime, endTime)) {
      alert(
        "The selected time slot is already booked. Please choose another time."
      );
      hasError = true;
    }

    if (hasError) {
      return false;
    }

    const newReservation = { name: animal, startTime, endTime, topic };
    setReservations([...reservations, newReservation]);
    setTopic("");
    setStartTime("");
    setEndTime("");
    setNameError(false);
    setStartTimeError(false);
    setEndTimeError(false);

    return true;
  };

  const convertTimeToNumber = (time: string) => {
    return parseInt(time.replace(":", ""), 10);
  };

  const sortedReservations = [...reservations].sort((a, b) => {
    return convertTimeToNumber(a.startTime) - convertTimeToNumber(b.startTime);
  });

  const handleVaraaClick = async () => {
    const isSubmitted = await handleSubmit();
    if (isSubmitted) {
      await setNewRandomAnimal();
      alert(`Your reservation for the animal "${animal}" has been saved.`);
      navigate("/");
    }
  };

  return (
    <div className="container1">
      <div className="header">
        <div className="time">{DateTime()}</div>
        <div className="logo1">
          <img
            className="logo"
            src="https://lut.pictures.fi/kuvat/LAB%20Press%20Images/LOGOS/LOGO%20FOR%20DISPLAYS/02%20LAB%20ENG%20WHITE.png?img=img2048"
            alt=""
          />
        </div>
      </div>
      <div className="content1">
        <div className="booked-times">
          <h2>SCHEDULE</h2>
          <div className="booked-times1">
            {sortedReservations.map((reservation, index) => (
              <div key={index} className="booked-time">
                <p>{reservation.name}</p>
                <p>
                  Klo. {reservation.startTime}-{reservation.endTime}
                </p>
                {reservation.topic && <p>{"Topic: " + reservation.topic}</p>}
              </div>
            ))}
          </div>
        </div>

        <div className="form-container">
          <h2>RESERVATION</h2>
          <div className="form-group">
            <label htmlFor="animal" className="form-label">
              Name (automatic)
            </label>
            <input
              id="animal"
              className={`form-control ${nameError ? "is-invalid" : ""}`}
              value={animal}
              readOnly
            />
            {nameError && (
              <div className="invalid-feedback">This field is required</div>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="start-time" className="form-label">
              Start Time
            </label>
            <select
              id="start-time"
              className={`form-control ${startTimeError ? "is-invalid" : ""}`}
              value={startTime}
              onChange={handleStartTimeChange}
            >
              <option value="" disabled>
                Choose start time
              </option>
              {[
                "06:00",
                "06:30",
                "07:00",
                "07:30",
                "08:00",
                "08:30",
                "09:00",
                "09:30",
                "10:00",
                "10:30",
                "11:00",
                "11:30",
                "12:00",
                "12:30",
                "13:00",
                "13:30",
                "14:00",
                "14:30",
                "15:00",
                "15:30",
                "16:00",
                "16:30",
                "17:00",
                "17:30",
                "18:00",
                "18:30",
                "19:00",
              ].map((time) => (
                <option key={time} value={time}>
                  {time}
                </option>
              ))}
            </select>
            {startTimeError && (
              <div className="invalid-feedback">This field is required</div>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="end-time" className="form-label">
              End Time
            </label>
            <select
              id="end-time"
              className={`form-control ${endTimeError ? "is-invalid" : ""}`}
              value={endTime}
              onChange={handleEndTimeChange}
            >
              <option value="" disabled>
                Choose end time
              </option>
              {[
                "06:30",
                "07:00",
                "07:30",
                "08:00",
                "08:30",
                "09:00",
                "09:30",
                "10:00",
                "10:30",
                "11:00",
                "11:30",
                "12:00",
                "12:30",
                "13:00",
                "13:30",
                "14:00",
                "14:30",
                "15:00",
                "15:30",
                "16:00",
                "16:30",
                "17:00",
                "17:30",
                "18:00",
                "18:30",
                "19:00",
                "19:30",
              ].map((time) => (
                <option key={time} value={time}>
                  {time}
                </option>
              ))}
            </select>
            {endTimeError && (
              <div className="invalid-feedback">This field is required</div>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="topic" className="form-label">
              Topic (optional)
            </label>
            <input
              id="topic"
              className="form-control"
              value={topic}
              onChange={handleTopicChange}
              placeholder="Enter topic here"
            />
          </div>

          <button className="button" onClick={handleVaraaClick}>
            RESERVE
          </button>
        </div>
      </div>
      <div className="footer1">
        <p></p>
        <div onClick={handleButtonClick} className="settings-button">
          Back
        </div>
      </div>
    </div>
  );
};

export default RoomReservation;
