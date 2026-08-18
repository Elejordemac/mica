import { useState } from 'react';
import { Link } from 'react-router-dom';
import { registerGuest } from '../api';
import styles from './RSVPForm.module.css';

interface RSVPFormProps {
  onBack: () => void;
}

interface FormErrors {
  [key: string]: string;
}

function RSVPForm({ onBack }: RSVPFormProps) {
  const [name, setName] = useState('');
  const [contactNumber, setContactNumber] = useState('');
  const [rsvpStatus, setRsvpStatus] = useState('Attending');
  const [companions, setCompanions] = useState(0);
  const [dietaryRestrictions, setDietaryRestrictions] = useState('');
  const [errors, setErrors] = useState<FormErrors>({});
  const [serverError, setServerError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErrors({});
    setServerError('');

    // Client-side validation
    const newErrors: FormErrors = {};
    if (!name.trim()) newErrors.name = 'Name is required';
    else if (name.trim().length > 100) newErrors.name = 'Name must be 100 characters or less';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setLoading(true);
    try {
      await registerGuest({
        name: name.trim(),
        rsvpStatus,
        companions,
        contactNumber: contactNumber.trim(),
        dietaryRestrictions: dietaryRestrictions.trim(),
      });
      setSuccess(true);
    } catch (err: unknown) {
      const error = err as { errors?: { field: string; message: string }[]; error?: string };
      if (error.errors) {
        const fieldErrors: FormErrors = {};
        error.errors.forEach((e) => {
          fieldErrors[e.field] = e.message;
        });
        setErrors(fieldErrors);
      } else {
        setServerError(error.error || 'Something went wrong. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  }

  if (success) {
    return (
      <div className={styles.successOverlay}>
        <div className={styles.confetti} aria-hidden="true">
          {Array.from({ length: 30 }).map((_, i) => (
            <div
              key={i}
              className={styles.confettiPiece}
              style={{
                left: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 2}s`,
                backgroundColor: ['#4fc3f7', '#81d4fa', '#b3e5fc', '#ffffff', '#0288d1'][
                  Math.floor(Math.random() * 5)
                ],
              }}
            />
          ))}
        </div>
        <div className={styles.successContent}>
          <div className={styles.successIcon}>🎉</div>
          <h2 className={styles.successTitle}>You're Registered!</h2>
          <p className={styles.successText}>Thank you for your RSVP. We can't wait to celebrate with you!</p>
          <Link to="/wishlist" className={styles.successBtn}>
            VIEW GIFT IDEAS
          </Link>
          <button onClick={onBack} className={styles.backLink}>
            ← Back to Invitation
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.formContainer}>
      <button onClick={onBack} className={styles.backBtn}>
        ← Back
      </button>
      <h2 className={styles.formTitle}>RSVP</h2>
      <p className={styles.formSubtitle}>We'd love to know if you can make it!</p>

      {serverError && <div className={styles.serverError}>{serverError}</div>}

      <form onSubmit={handleSubmit} className={styles.form} noValidate>
        <div className={styles.field}>
          <label htmlFor="name" className={styles.label}>Full Name *</label>
          <input
            id="name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className={`${styles.input} ${errors.name ? styles.inputError : ''}`}
            placeholder="Your full name"
            maxLength={100}
          />
          {errors.name && <span className={styles.error}>{errors.name}</span>}
        </div>

        <div className={styles.field}>
          <label htmlFor="contactNumber" className={styles.label}>Contact Number (optional)</label>
          <input
            id="contactNumber"
            type="tel"
            value={contactNumber}
            onChange={(e) => setContactNumber(e.target.value)}
            className={`${styles.input} ${errors.contactNumber ? styles.inputError : ''}`}
            placeholder="e.g. 0412 345 678"
            maxLength={20}
          />
          {errors.contactNumber && <span className={styles.error}>{errors.contactNumber}</span>}
        </div>

        <div className={styles.field}>
          <label htmlFor="rsvpStatus" className={styles.label}>Will you attend? *</label>
          <select
            id="rsvpStatus"
            value={rsvpStatus}
            onChange={(e) => setRsvpStatus(e.target.value)}
            className={styles.select}
          >
            <option value="Attending">Attending</option>
            <option value="Not Attending">Not Attending</option>
            <option value="Undecided">Undecided</option>
          </select>
          {errors.rsvpStatus && <span className={styles.error}>{errors.rsvpStatus}</span>}
        </div>

        <div className={styles.field}>
          <label htmlFor="companions" className={styles.label}>Number of Companions</label>
          <select
            id="companions"
            value={companions}
            onChange={(e) => setCompanions(Number(e.target.value))}
            className={styles.select}
          >
            {[0, 1, 2, 3, 4, 5].map((n) => (
              <option key={n} value={n}>{n}</option>
            ))}
          </select>
        </div>

        <div className={styles.field}>
          <label htmlFor="dietary" className={styles.label}>
            Dietary Restrictions / Allergies
          </label>
          <textarea
            id="dietary"
            value={dietaryRestrictions}
            onChange={(e) => setDietaryRestrictions(e.target.value)}
            className={styles.textarea}
            placeholder="Any allergies or dietary needs..."
            maxLength={200}
            rows={3}
          />
          <span className={styles.charCount}>{dietaryRestrictions.length}/200</span>
          {errors.dietaryRestrictions && <span className={styles.error}>{errors.dietaryRestrictions}</span>}
        </div>

        <button type="submit" className={styles.submitBtn} disabled={loading}>
          {loading ? 'Submitting...' : 'SUBMIT RSVP'}
        </button>
      </form>
    </div>
  );
}

export default RSVPForm;
