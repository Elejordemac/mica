import { Link } from 'react-router-dom';
import HeroElement from './HeroElement';
import Countdown from './Countdown';
import styles from './Invitation.module.css';

interface InvitationProps {
  onRSVP: () => void;
}

function Invitation({ onRSVP }: InvitationProps) {
  return (
    <div className={styles.invitation}>
      <HeroElement />

      <div className={styles.content}>
        <h1 className={styles.title}>YOU ARE INVITED!</h1>
        <p className={styles.subtitle}>to a Baby Shower</p>
        <div className={styles.genderBadge}>It's a Boy! 💙</div>

        <Countdown />

        <div className={styles.details}>
          <div className={styles.detailItem}>
            <span className={styles.detailIcon}>📅</span>
            <span>September 12, 2026</span>
          </div>
          <div className={styles.detailItem}>
            <span className={styles.detailIcon}>🕚</span>
            <span>11:00 AM AEST</span>
          </div>
          <div className={styles.detailItem}>
            <span className={styles.detailIcon}>📍</span>
            <a
              href="https://www.google.com/maps/place/10+Peckham+Ave,+Chatswood+NSW+2067,+Australia/@-33.7913439,151.1779428,17z/"
              target="_blank"
              rel="noopener noreferrer"
              className={styles.link}
            >
              10 Peckham Ave, Chatswood NSW 2067
            </a>
          </div>
          <div className={styles.detailItem}>
            <span className={styles.detailIcon}>📞</span>
            <a href="tel:0431335917" className={styles.link}>
              0431 335 917 – Mica
            </a>
          </div>
        </div>

        <div className={styles.buttons}>
          <button className={styles.primaryBtn} onClick={onRSVP}>
            RSVP NOW
          </button>
          <p className={styles.deadline}>⏰ RSVP by August 31, 2026 — 1:00 PM</p>
          <Link to="/guests" className={styles.secondaryBtn}>
            VIEW GUEST LIST
          </Link>
          <Link to="/wishlist" className={styles.secondaryBtn}>
            GIFT IDEAS
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Invitation;
