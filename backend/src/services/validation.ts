export interface GuestInput {
  name: string;
  email: string;
  rsvpStatus: string;
  companions?: number;
  dietaryRestrictions?: string;
}

export interface ValidationError {
  field: string;
  message: string;
}

export function validateGuestInput(data: Partial<GuestInput>): ValidationError[] {
  const errors: ValidationError[] = [];

  // Name validation
  if (!data.name || data.name.trim().length === 0) {
    errors.push({ field: 'name', message: 'Name is required' });
  } else if (data.name.trim().length > 100) {
    errors.push({ field: 'name', message: 'Name must be 100 characters or less' });
  }

  // Email validation
  if (!data.email || data.email.trim().length === 0) {
    errors.push({ field: 'email', message: 'Email is required' });
  } else {
    const email = data.email.trim().toLowerCase();
    if (!isValidEmail(email)) {
      errors.push({ field: 'email', message: 'Please enter a valid email address' });
    }
  }

  // RSVP Status validation
  const validStatuses = ['Attending', 'Not Attending', 'Undecided'];
  if (!data.rsvpStatus || !validStatuses.includes(data.rsvpStatus)) {
    errors.push({ field: 'rsvpStatus', message: 'RSVP status must be Attending, Not Attending, or Undecided' });
  }

  // Companions validation
  if (data.companions !== undefined && data.companions !== null) {
    const comp = Number(data.companions);
    if (isNaN(comp) || comp < 0 || comp > 5 || !Number.isInteger(comp)) {
      errors.push({ field: 'companions', message: 'Companions must be a whole number between 0 and 5' });
    }
  }

  // Dietary restrictions validation
  if (data.dietaryRestrictions && data.dietaryRestrictions.length > 200) {
    errors.push({ field: 'dietaryRestrictions', message: 'Dietary restrictions must be 200 characters or less' });
  }

  return errors;
}

function isValidEmail(email: string): boolean {
  // Check for single @
  const parts = email.split('@');
  if (parts.length !== 2) return false;

  const [local, domain] = parts;

  // Local part checks
  if (local.length === 0) return false;

  // Domain checks
  if (domain.length === 0) return false;
  if (domain.startsWith('.') || domain.endsWith('.')) return false;
  if (!domain.includes('.')) return false;

  // Basic format check
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}
