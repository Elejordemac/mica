import styles from './FloatingParticles.module.css';

function FloatingParticles() {
  return (
    <div className={styles.particles} aria-hidden="true">
      {Array.from({ length: 20 }).map((_, i) => (
        <div
          key={i}
          className={styles.particle}
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 8}s`,
            animationDuration: `${6 + Math.random() * 8}s`,
            width: `${4 + Math.random() * 8}px`,
            height: `${4 + Math.random() * 8}px`,
            opacity: 0.2 + Math.random() * 0.4,
          }}
        />
      ))}
      {/* Floating stars */}
      {Array.from({ length: 8 }).map((_, i) => (
        <div
          key={`star-${i}`}
          className={styles.star}
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 5}s`,
            animationDuration: `${3 + Math.random() * 4}s`,
          }}
        >
          ✦
        </div>
      ))}
    </div>
  );
}

export default FloatingParticles;
