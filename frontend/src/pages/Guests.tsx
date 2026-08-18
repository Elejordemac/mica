import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { fetchGuests, Guest } from '../api';
import FloatingParticles from '../components/FloatingParticles';
import styles from './Guests.module.css';

function Guests() {
  const [guests, setGuests] = useState<Guest[]>([]);
  const [counts, setCounts] = useState({ attending: 0, notAttending: 0, total: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  async function loadGuests() {
    try {
      const data = await fetchGuests();
      setGuests(data.guests);
      setCounts(data.counts);
      setError('');
    } catch (err) {
      if (loading) {
        setError((err as Error).message);
      }
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadGuests();
    intervalRef.current = setInterval(loadGuests, 5000);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  function getStatusBadge(status: string) {
    const classes: Record<string, string> = {
      Attending: styles.badgeGreen,
      'Not Attending': styles.badgeRed,
      Undecided: styles.badgeYellow,
      Approved: styles.badgeGreen,
      Pending: styles.badgeOrange,
    };
    return <span className={`${styles.badge} ${classes[status] || ''}`}>{status}</span>;
  }

  if (loading) {
    return (
      <div className={styles.container}>
        <FloatingParticles />
        <div className={styles.loading}>Loading guest list...</div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <FloatingParticles />
      <div className={styles.content}>
        <Link to="/" className={styles.backBtn}>← Back to Invitation</Link>
        <h1 className={styles.title}>Guest List</h1>

        <div className={styles.summary}>
          <div className={styles.summaryItem}>
            <span className={styles.summaryCount}>{counts.attending}</span>
            <span className={styles.summaryLabel}>Attending</span>
          </div>
          <div className={styles.summaryItem}>
            <span className={styles.summaryCount}>{counts.notAttending}</span>
            <span className={styles.summaryLabel}>Not Attending</span>
          </div>
          <div className={styles.summaryItem}>
            <span className={styles.summaryCount}>{counts.total}</span>
            <span className={styles.summaryLabel}>Total RSVPs</span>
          </div>
        </div>

        {error && (
          <div className={styles.error}>
            {error}
            <button onClick={loadGuests} className={styles.retryBtn}>Retry</button>
          </div>
        )}

        {guests.length === 0 ? (
          <div className={styles.empty}>
            <p>No guests have registered yet.</p>
            <p>Be the first to RSVP!</p>
          </div>
        ) : (
          <div className={styles.cardList}>
            {guests.map((guest) => (
              <div key={guest.id} className={styles.card}>
                <div className={styles.cardRow}>
                  <span className={styles.cardLabel}>NAME</span>
                  <span className={styles.cardValue}>{guest.name}</span>
                </div>
                <div className={styles.cardRow}>
                  <span className={styles.cardLabel}>RSVP</span>
                  <span className={styles.cardValue}>{getStatusBadge(guest.rsvpStatus)}</span>
                </div>
                <div className={styles.cardRow}>
                  <span className={styles.cardLabel}>COMPANIONS</span>
                  <span className={styles.cardValue}>{guest.companions > 0 ? `+${guest.companions}` : '—'}</span>
                </div>
                <div className={styles.cardRow}>
                  <span className={styles.cardLabel}>APPROVAL</span>
                  <span className={styles.cardValue}>{getStatusBadge(guest.approvalStatus)}</span>
                </div>
                <div className={styles.cardRow}>
                  <span className={styles.cardLabel}>REGISTERED</span>
                  <span className={styles.cardValue}>
                    {new Date(guest.submittedAt).toLocaleString(undefined, {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Guests;
