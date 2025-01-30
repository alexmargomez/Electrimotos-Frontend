import React, { useState, useEffect } from 'react';

const DateTimeDisplay = () => {
  const [dateTime, setDateTime] = useState(new Date().toLocaleString("es-CO"));

  useEffect(() => {
    const intervalId = setInterval(() => {
      setDateTime(new Date().toLocaleString("es-CO"));
    }, 1000);

    return () => clearInterval(intervalId);
  }, []);

  return (
      <p>{dateTime}</p>
  );
};

export default DateTimeDisplay;
