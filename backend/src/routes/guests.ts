import { Router, Request, Response } from 'express';
import { query } from '../db';
import { validateGuestInput } from '../services/validation';

const router = Router();

// GET /api/guests - Get all guests (public)
router.get('/', async (_req: Request, res: Response) => {
  try {
    const result = await query(`
      SELECT id, name, contact_number, rsvp_status, approval_status, companions, submitted_at
      FROM guests
      ORDER BY submitted_at DESC
    `);

    const guests = result.rows.map(row => ({
      id: row.id,
      name: row.name,
      contactNumber: row.contact_number,
      rsvpStatus: row.rsvp_status,
      approvalStatus: row.approval_status,
      companions: row.companions,
      submittedAt: row.submitted_at,
    }));

    // Calculate counts (including companions)
    const attending = guests.filter(g => g.rsvpStatus === 'Attending');
    const attendingCount = attending.length + attending.reduce((sum, g) => sum + g.companions, 0);
    const notAttendingCount = guests.filter(g => g.rsvpStatus === 'Not Attending').length;
    const totalGuests = guests.length;

    res.json({
      guests,
      counts: {
        attending: attendingCount,
        notAttending: notAttendingCount,
        total: totalGuests,
      },
    });
  } catch (err) {
    console.error('Error fetching guests:', err);
    if ((err as NodeJS.ErrnoException).code === 'ECONNREFUSED') {
      res.status(503).json({ error: 'Database connection unavailable' });
    } else {
      res.status(500).json({ error: 'Failed to fetch guests' });
    }
  }
});

// POST /api/guests - Register guest
router.post('/', async (req: Request, res: Response) => {
  try {
    const { name, rsvpStatus, companions, contactNumber, dietaryRestrictions } = req.body;

    // Validate input
    const errors = validateGuestInput({ name, rsvpStatus, companions, contactNumber, dietaryRestrictions });
    if (errors.length > 0) {
      res.status(400).json({ errors });
      return;
    }

    const normalizedName = name.trim();
    const comp = companions ? Number(companions) : 0;
    const contact = contactNumber?.trim() || '';
    const dietary = dietaryRestrictions?.trim() || '';

    // Check if same name already exists (upsert by name)
    const existing = await query('SELECT id FROM guests WHERE LOWER(name) = LOWER($1)', [normalizedName]);

    if (existing.rows.length > 0) {
      // Update existing record
      const updateResult = await query(
        `UPDATE guests 
         SET rsvp_status = $1, companions = $2, contact_number = $3, dietary_restrictions = $4, updated_at = NOW()
         WHERE LOWER(name) = LOWER($5)
         RETURNING id, name, contact_number, rsvp_status, approval_status, companions, dietary_restrictions, submitted_at`,
        [rsvpStatus, comp, contact, dietary, normalizedName]
      );

      const guest = updateResult.rows[0];
      res.status(200).json({
        message: 'Registration updated successfully',
        guest: {
          id: guest.id,
          name: guest.name,
          contactNumber: guest.contact_number,
          rsvpStatus: guest.rsvp_status,
          approvalStatus: guest.approval_status,
          companions: guest.companions,
          dietaryRestrictions: guest.dietary_restrictions,
          submittedAt: guest.submitted_at,
        },
      });
    } else {
      // Insert new record
      const insertResult = await query(
        `INSERT INTO guests (name, email, rsvp_status, companions, contact_number, dietary_restrictions)
         VALUES ($1, '', $2, $3, $4, $5)
         RETURNING id, name, contact_number, rsvp_status, approval_status, companions, dietary_restrictions, submitted_at`,
        [normalizedName, rsvpStatus, comp, contact, dietary]
      );

      const guest = insertResult.rows[0];
      res.status(201).json({
        message: 'Registration successful',
        guest: {
          id: guest.id,
          name: guest.name,
          contactNumber: guest.contact_number,
          rsvpStatus: guest.rsvp_status,
          approvalStatus: guest.approval_status,
          companions: guest.companions,
          dietaryRestrictions: guest.dietary_restrictions,
          submittedAt: guest.submitted_at,
        },
      });
    }
  } catch (err) {
    console.error('Error registering guest:', err);
    if ((err as NodeJS.ErrnoException).code === 'ECONNREFUSED') {
      res.status(503).json({ error: 'Database connection unavailable' });
    } else {
      res.status(500).json({ error: 'Failed to register guest' });
    }
  }
});

export default router;
