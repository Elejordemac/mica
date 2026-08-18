import styles from './HeroElement.module.css';

function HeroElement() {
  return (
    <div className={styles.heroWrapper}>
      <div className={styles.glowRing} />
      <svg
        className={styles.heroSvg}
        viewBox="0 0 200 200"
        xmlns="http://www.w3.org/2000/svg"
        aria-label="Baby boy themed decoration"
        role="img"
      >
        {/* Baby bottle shape */}
        <defs>
          <linearGradient id="bottleGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#81d4fa" />
            <stop offset="100%" stopColor="#4fc3f7" />
          </linearGradient>
          <linearGradient id="capGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#0288d1" />
            <stop offset="100%" stopColor="#01579b" />
          </linearGradient>
          <filter id="glow">
            <feGaussianBlur stdDeviation="3" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Bottle cap */}
        <rect x="85" y="25" width="30" height="20" rx="4" fill="url(#capGrad)" />
        <rect x="80" y="42" width="40" height="8" rx="4" fill="url(#capGrad)" />

        {/* Bottle neck */}
        <path
          d="M 88 50 L 88 65 Q 88 70 83 75 L 75 85 Q 70 90 70 95 L 70 155 Q 70 165 80 165 L 120 165 Q 130 165 130 155 L 130 95 Q 130 90 125 85 L 117 75 Q 112 70 112 65 L 112 50"
          fill="url(#bottleGrad)"
          filter="url(#glow)"
          opacity="0.9"
        />

        {/* Milk level */}
        <path
          d="M 75 110 L 125 110 L 130 155 Q 130 165 120 165 L 80 165 Q 70 165 70 155 Z"
          fill="rgba(255, 255, 255, 0.3)"
        />

        {/* Measurement lines */}
        <line x1="74" y1="100" x2="82" y2="100" stroke="rgba(255,255,255,0.4)" strokeWidth="1" />
        <line x1="74" y1="115" x2="82" y2="115" stroke="rgba(255,255,255,0.4)" strokeWidth="1" />
        <line x1="74" y1="130" x2="82" y2="130" stroke="rgba(255,255,255,0.4)" strokeWidth="1" />
        <line x1="74" y1="145" x2="82" y2="145" stroke="rgba(255,255,255,0.4)" strokeWidth="1" />

        {/* Heart decoration */}
        <path
          d="M 100 120 C 100 115, 93 110, 93 116 C 93 122, 100 128, 100 128 C 100 128, 107 122, 107 116 C 107 110, 100 115, 100 120 Z"
          fill="rgba(255, 255, 255, 0.5)"
        />

        {/* Small stars around */}
        <text x="50" y="60" fontSize="12" fill="#81d4fa" opacity="0.7">✦</text>
        <text x="145" y="55" fontSize="10" fill="#4fc3f7" opacity="0.5">✦</text>
        <text x="40" y="140" fontSize="8" fill="#b3e5fc" opacity="0.6">✦</text>
        <text x="155" y="135" fontSize="11" fill="#81d4fa" opacity="0.5">✦</text>
        <text x="55" y="175" fontSize="9" fill="#4fc3f7" opacity="0.4">★</text>
        <text x="140" y="175" fontSize="9" fill="#81d4fa" opacity="0.4">★</text>
      </svg>
    </div>
  );
}

export default HeroElement;
