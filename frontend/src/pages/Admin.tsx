import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { login, fetchAdminGuests, updateGuest, deleteGuest, approveGuest, Guest } from '../api';
import styles from './Admin.module.css';

function Admin() {
  const [token, setToken] = useState(() => localStorage.getItem('adminToken') || '');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [loginLoading, setLoginLoading] = useState(false);

  const [guests, setGuests] = useState<Guest[]>([]);
  const [counts, setCounts] = useState({ attending: 0, notAttending: 0, total: 0 });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [search, setSearch] = useState('');

  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState('');
  const [editContact, setEditContact] = useState('');
  const [editRsvp, setEditRsvp] = useState('');

  const loadGuests = useCallback(async () => {
    if (!token) return;
    setLoading(true);
    try {
      const data = await fetchAdminGuests(token, filterStatus, search);
      setGuests(data.guests);
      setCounts(data.counts);
      setError('');
    } catch (err) {
      const msg = (err as Error).message;
      if (msg === 'Unauthorized') {
        setToken('');
        localStorage.removeItem('adminToken');
      }
      setError(msg);
    } finally {
      setLoading(false);
    }
  }, [token, filterStatus, search]);

  useEffect(() => {
    if (token) loadGuests();
  }, [token, filterStatus, search, loadGuests]);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoginError('');
    setLoginLoading(true);
    try {
      const newToken = await login(password);
      setToken(newToken);
      localStorage.setItem('adminToken', newToken);
    } catch (err) {
      setLoginError((err as Error).message);
    } finally {
      setLoginLoading(false);
    }
  }

  function handleLogout() {
    setToken('');
    localStorage.removeItem('adminToken');
  }

  function startEdit(guest: Guest) {
    setEditingId(guest.id);
    setEditName(guest.name);
    setEditContact(guest.contactNumber || '');
    setEditRsvp(guest.rsvpStatus);
  }

  async function saveEdit(id: string) {
    try {
      await updateGuest(token, id, { name: editName, rsvpStatus: editRsvp, contactNumber: editContact });
      setEditingId(null);
      loadGuests();
    } catch (err) {
      alert((err as Error).message);
    }
  }

  async function handleDelete(id: string, name: string) {
    if (!confirm(`Delete guest "${name}"? This cannot be undone.`)) return;
    try {
      await deleteGuest(token, id);
      loadGuests();
    } catch (err) {
      alert((err as Error).message);
    }
  }

  async function handleApprove(id: string) {
    try {
      await approveGuest(token, id);
      loadGuests();
    } catch (err) {
      alert((err as Error).message);
    }
  }

  // Login screen
  if (!token) {
    return (
      <div className={styles.loginContainer}>
        <div className={styles.loginCard}>
          <h1 className={styles.loginTitle}>Admin Login</h1>
          {loginError && <div className={styles.loginError}>{loginError}</div>}
          <form onSubmit={handleLogin}>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter admin password"
              className={styles.loginInput}
              autoFocus
            />
            <button type="submit" className={styles.loginBtn} disabled={loginLoading}>
              {loginLoading ? 'Logging in...' : 'LOGIN'}
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>Admin Panel</h1>
        <div className={styles.headerActions}>
          <Link to="/" className={styles.homeBtn}>🏠 Homepage</Link>
          <button onClick={handleLogout} className={styles.logoutBtn}>Logout</button>
        </div>
      </div>

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
          <span className={styles.summaryLabel}>Total</span>
        </div>
      </div>

      <div className={styles.filters}>
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className={styles.filterSelect}
        >
          <option value="all">All Statuses</option>
          <option value="Attending">Attending</option>
          <option value="Not Attending">Not Attending</option>
          <option value="Undecided">Undecided</option>
        </select>
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by name..."
          className={styles.searchInput}
        />
      </div>

      {error && (
        <div className={styles.error}>
          {error}
          <button onClick={loadGuests} className={styles.retryBtn}>Retry</button>
        </div>
      )}

      {loading ? (
        <div className={styles.loading}>Loading...</div>
      ) : guests.length === 0 ? (
        <div className={styles.empty}>No guests found.</div>
      ) : (
        <div className={styles.tableWrapper}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Name</th>
                <th>Contact</th>
                <th>RSVP</th>
                <th>+</th>
                <th>Dietary</th>
                <th>Status</th>
                <th>Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {guests.map((guest) => (
                <tr key={guest.id}>
                  {editingId === guest.id ? (
                    <>
                      <td>
                        <input value={editName} onChange={(e) => setEditName(e.target.value)} className={styles.editInput} />
                      </td>
                      <td>
                        <input value={editContact} onChange={(e) => setEditContact(e.target.value)} className={styles.editInput} />
                      </td>
                      <td>
                        <select value={editRsvp} onChange={(e) => setEditRsvp(e.target.value)} className={styles.editSelect}>
                          <option value="Attending">Attending</option>
                          <option value="Not Attending">Not Attending</option>
                          <option value="Undecided">Undecided</option>
                        </select>
                      </td>
                      <td>{guest.companions > 0 ? `+${guest.companions}` : '—'}</td>
                      <td className={styles.dietaryCell}>{guest.dietaryRestrictions || '—'}</td>
                      <td><span className={styles.badge}>{guest.approvalStatus}</span></td>
                      <td className={styles.dateCell}>{new Date(guest.submittedAt).toLocaleDateString()}</td>
                      <td className={styles.actions}>
                        <button onClick={() => saveEdit(guest.id)} className={styles.saveBtn}>Save</button>
                        <button onClick={() => setEditingId(null)} className={styles.cancelBtn}>Cancel</button>
                      </td>
                    </>
                  ) : (
                    <>
                      <td>{guest.name}</td>
                      <td className={styles.contactCell}>{guest.contactNumber || '—'}</td>
                      <td><span className={styles.badge}>{guest.rsvpStatus}</span></td>
                      <td>{guest.companions > 0 ? `+${guest.companions}` : '—'}</td>
                      <td className={styles.dietaryCell}>{guest.dietaryRestrictions || '—'}</td>
                      <td><span className={styles.badge}>{guest.approvalStatus}</span></td>
                      <td className={styles.dateCell}>{new Date(guest.submittedAt).toLocaleDateString()}</td>
                      <td className={styles.actions}>
                        {guest.approvalStatus === 'Pending' && (
                          <button onClick={() => handleApprove(guest.id)} className={styles.approveBtn}>Approve</button>
                        )}
                        <button onClick={() => startEdit(guest)} className={styles.editBtn}>Edit</button>
                        <button onClick={() => handleDelete(guest.id, guest.name)} className={styles.deleteBtn}>Delete</button>
                      </td>
                    </>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default Admin;
