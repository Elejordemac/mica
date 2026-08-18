import { Router, Response } from 'express';
import { query } from '../db';
import { authMiddleware, AuthRequest } from '../middleware/auth';
import { validateGuestInput } from '../services/validation';

const router = Router();

// All admin routes require authentication
router.use(authMiddleware);

// GET /api/admin/guests - Get all guests with full details + filtering
router.get('/guests', async (req: AuthRequest, res: Response) => {
  try {
    const { status, search } = req.query;

    let sql = `
      SELECT id, name, email, rsvp_status, approval_status, companions, 
             dietary_restrictions, submitted_at, updated_at
      FROM guests
      WHERE 1=1
    `;
    const params: unknown[] = [];
    let paramIndex = 1;

    if (status && typeof status === 'string' && status !== 'all') {
      sql += ` AND rsvp_status = $${paramIndex}`;
      params.push(status);
      paramIndex++;
    }

    if (search && typeof search === 'string' && search.trim().length > 0) {
      sql += ` AND (LOWER(name) LIKE $${paramIndex} OR LOWER(email) LIKE $${paramIndex})`;
      params.push(`%${search.trim().toLowerCase()}%`);
      paramIndex++;
    }

    sql += ' ORDER BY submitted_at DESC';

    const result = await query(sql, params);

    const guests = result.rows.map(row => ({
      id: row.id,
      name: row.name,
      email: row.email,
      rsvpStatus: row.rsvp_status,
      approvalStatus: row.approval_status,
      companions: row.companions,
      dietaryRestrictions: row.dietary_restrictions,
      submittedAt: row.submitted_at,
      updatedAt: row.updated_at,
    }));

    const attending = guests.filter(g => g.rsvpStatus === 'Attending');
    const attendingCount = attending.length + attending.reduce((sum, g) => sum + g.companions, 0);
    const notAttendingCount = guests.filter(g => g.rsvpStatus === 'Not Attending').length;

    res.json({
      guests,
      counts: {
        attending: attendingCount,
        notAttending: notAttendingCount,
        total: guests.length,
      },
    });
  } catch (err) {
    console.error('Error fetching admin guests:', err);
    if ((err as NodeJS.ErrnoException).code === 'ECONNREFUSED') {
      res.status(503).json({ error: 'Database connection unavailable' });
    } else {
      res.status(500).json({ error: 'Failed to fetch guests' });
    }
  }
});

// PUT /api/admin/guests/:id - Update guest
router.put('/guests/:id', async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { name, email, rsvpStatus } = req.body;

    // Check if guest exists
    const existing = await query('SELECT id FROM guests WHERE id = $1', [id]);
    if (existing.rows.length === 0) {
      res.status(404).json({ error: 'Guest not found' });
      return;
    }

    // Validate input
    const errors = validateGuestInput({ name, email, rsvpStatus });
    if (errors.length > 0) {
      res.status(400).json({ errors });
      return;
    }

    const normalizedEmail = email.trim().toLowerCase();

    // Check email uniqueness (exclude current guest)
    const emailCheck = await query('SELECT id FROM guests WHERE email = $1 AND id != $2', [normalizedEmail, id]);
    if (emailCheck.rows.length > 0) {
      res.status(409).json({ error: 'Email already in use by another guest' });
      return;
    }

    const result = await query(
      `UPDATE guests SET name = $1, email = $2, rsvp_status = $3, updated_at = NOW()
       WHERE id = $4
       RETURNING id, name, email, rsvp_status, approval_status, companions, dietary_restrictions, submitted_at`,
      [name.trim(), normalizedEmail, rsvpStatus, id]
    );

    const guest = result.rows[0];
    res.json({
      message: 'Guest updated successfully',
      guest: {
        id: guest.id,
        name: guest.name,
        email: guest.email,
        rsvpStatus: guest.rsvp_status,
        approvalStatus: guest.approval_status,
        companions: guest.companions,
        dietaryRestrictions: guest.dietary_restrictions,
        submittedAt: guest.submitted_at,
      },
    });
  } catch (err) {
    console.error('Error updating guest:', err);
    res.status(500).json({ error: 'Failed to update guest' });
  }
});

// DELETE /api/admin/guests/:id - Delete guest
router.delete('/guests/:id', async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;

    const result = await query('DELETE FROM guests WHERE id = $1 RETURNING id', [id]);
    if (result.rows.length === 0) {
      res.status(404).json({ error: 'Guest not found' });
      return;
    }

    res.json({ message: 'Guest deleted successfully' });
  } catch (err) {
    console.error('Error deleting guest:', err);
    res.status(500).json({ error: 'Failed to delete guest' });
  }
});

// POST /api/admin/guests/:id/approve - Approve guest
router.post('/guests/:id/approve', async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;

    const existing = await query('SELECT id, approval_status FROM guests WHERE id = $1', [id]);
    if (existing.rows.length === 0) {
      res.status(404).json({ error: 'Guest not found' });
      return;
    }

    if (existing.rows[0].approval_status === 'Approved') {
      res.status(400).json({ error: 'Guest is already approved' });
      return;
    }

    await query(
      'UPDATE guests SET approval_status = $1, updated_at = NOW() WHERE id = $2',
      ['Approved', id]
    );

    res.json({ message: 'Guest approved successfully' });
  } catch (err) {
    console.error('Error approving guest:', err);
    res.status(500).json({ error: 'Failed to approve guest' });
  }
});

export default router;
