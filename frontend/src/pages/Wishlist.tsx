import { Link } from 'react-router-dom';
import FloatingParticles from '../components/FloatingParticles';
import styles from './Wishlist.module.css';

function Wishlist() {
  return (
    <div className={styles.container}>
      <FloatingParticles />
      <div className={styles.content}>
        <Link to="/" className={styles.backBtn}>← Back to Invitation</Link>

        <div className={styles.header}>
          <h1 className={styles.title}>Baby Boy's Wishlist</h1>
          <div className={styles.genderBadge}>It's a Boy! 💙</div>
        </div>

        <div className={styles.messageCard}>
          <p className={styles.message}>
            Your love, presence, and prayers are all that we request. But if you wish to give a gift,
            we've put together a registry to make it easier for you!
          </p>
        </div>

        <div className={styles.registryCard}>
          <div className={styles.registryIcon}>🎁</div>
          <h2 className={styles.registryTitle}>Gift Registry</h2>
          <p className={styles.registryText}>
            Click the link below to view our full gift registry. You'll find a curated list of items
            we'd love for our little one!
          </p>
          <a
            href="https://www.myregistry.com/baby-registry/krissy-baluyut-chatswood-new-south-wales/5588089"
            target="_blank"
            rel="noopener noreferrer"
            className={styles.registryBtn}
          >
            VIEW FULL REGISTRY →
          </a>
          <p className={styles.registryNote}>
            You can browse, choose, and purchase items directly from the registry.
          </p>
        </div>

        <div className={styles.footer}>
          <p>Thank you for your love and generosity! 💙</p>
        </div>
      </div>
    </div>
  );
}

export default Wishlist;
