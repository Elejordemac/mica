-- Baby Shower Guest Registration Database Schema
-- Run this SQL against your PostgreSQL database to create the table

CREATE TABLE IF NOT EXISTS guests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(100) NOT NULL,
  email VARCHAR(254) NOT NULL UNIQUE,
  rsvp_status VARCHAR(20) NOT NULL CHECK (rsvp_status IN ('Attending', 'Not Attending', 'Undecided')),
  approval_status VARCHAR(20) NOT NULL DEFAULT 'Pending' CHECK (approval_status IN ('Pending', 'Approved')),
  companions INTEGER NOT NULL DEFAULT 0 CHECK (companions >= 0 AND companions <= 5),
  dietary_restrictions VARCHAR(200) DEFAULT '',
  submitted_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Create index on email for fast lookups
CREATE INDEX IF NOT EXISTS idx_guests_email ON guests(email);
