import { useState, useEffect } from 'react';
import styles from './Countdown.module.css';

// September 12, 2026, 11:00 AM AEST (UTC+10)
const EVENT_DATE = new Date('2026-09-12T01:00:00Z'); // 11 AM AEST = 01:00 UTC

function Countdown() {
  const [timeLeft, setTimeLeft] = useState(getTimeLeft());

  function getTimeLeft() {
    const now = new Date();
    const diff = EVENT_DATE.getTime() - now.getTime();

    if (diff <= 0) {
      return { days: 0, hours: 0, minutes: 0, seconds: 0 };
    }

    return {
      days: Math.floor(diff / (1000 * 60 * 60 * 24)),
      hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
      minutes: Math.floor((diff / (1000 * 60)) % 60),
      seconds: Math.floor((diff / 1000) % 60),
    };
  }

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(getTimeLeft());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className={styles.countdown} aria-label="Countdown to event">
      <div className={styles.unit}>
        <span className={styles.number}>{timeLeft.days}</span>
        <span className={styles.label}>Days</span>
      </div>
      <span className={styles.separator}>:</span>
      <div className={styles.unit}>
        <span className={styles.number}>{String(timeLeft.hours).padStart(2, '0')}</span>
        <span className={styles.label}>Hours</span>
      </div>
      <span className={styles.separator}>:</span>
      <div className={styles.unit}>
        <span className={styles.number}>{String(timeLeft.minutes).padStart(2, '0')}</span>
        <span className={styles.label}>Minutes</span>
      </div>
      <span className={styles.separator}>:</span>
      <div className={styles.unit}>
        <span className={styles.number}>{String(timeLeft.seconds).padStart(2, '0')}</span>
        <span className={styles.label}>Seconds</span>
      </div>
    </div>
  );
}

export default Countdown;
