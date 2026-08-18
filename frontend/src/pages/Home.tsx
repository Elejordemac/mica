import { useState } from 'react';
import Invitation from '../components/Invitation';
import RSVPForm from '../components/RSVPForm';
import FloatingParticles from '../components/FloatingParticles';
import styles from './Home.module.css';

function Home() {
  const [showForm, setShowForm] = useState(false);

  return (
    <div className={styles.container}>
      <FloatingParticles />
      {showForm ? (
        <RSVPForm onBack={() => setShowForm(false)} />
      ) : (
        <Invitation onRSVP={() => setShowForm(true)} />
      )}
    </div>
  );
}

export default Home;
