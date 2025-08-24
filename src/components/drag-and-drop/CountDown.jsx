import { useEffect, useState } from 'react';

const CountDown = ({time}) => {
  const targetDate = new Date(time);
  const countdownTime = 1 * 60 * 60 + 59 * 60; // 1 hour and 59 minutes in seconds

  const calculateTimeRemaining = () => {
    const currentTime = new Date().getTime() / 1000;
    const targetDateInSeconds = targetDate.getTime() / 1000 + countdownTime;

    const distance = targetDateInSeconds - currentTime;

    if (distance <= 0) {
      return {
        timerHours: "00",
        timerMinutes: "00",
        timerSeconds: "00",
      };
    } else {
      const remainingHours = Math.floor(distance / 3600);
      const remainingMinutes = Math.floor((distance % 3600) / 60);
      const remainingSeconds = Math.floor(distance % 60);

      return {
        timerHours: String(remainingHours).padStart(2, "0"),
        timerMinutes: String(remainingMinutes).padStart(2, "0"),
        timerSeconds: String(remainingSeconds).padStart(2, "0"),
      };
    }
  };

  const [timerHours, setTimerHours] = useState("00");
  const [timerMinutes, setTimerMinutes] = useState("00");
  const [timerSeconds, setTimerSeconds] = useState("00");

  useEffect(() => {
    const interval = setInterval(() => {
      const { timerHours, timerMinutes, timerSeconds } = calculateTimeRemaining();
      setTimerHours(timerHours);
      setTimerMinutes(timerMinutes);
      setTimerSeconds(timerSeconds);
    }, 1000);

    return () => {
      clearInterval(interval);
    };
  }, [calculateTimeRemaining]);

  return (
    <>
      {timerHours}:{timerMinutes}:{timerSeconds}
    </>
  );
};

export default CountDown;
