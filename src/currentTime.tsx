import { useState, useEffect } from "react";

export const DateTime = () => {
  var [date, setDate] = useState(new Date());

  useEffect(() => {
    var timer = setInterval(() => setDate(new Date()), 1000);
    return function cleanup() {
      clearInterval(timer);
    };
  });

  return (
    <p>
      Time:{" "}
      {date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
    </p>
  );
};

export default DateTime;
