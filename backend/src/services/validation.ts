export interface GuestInput {
  name: string;
  rsvpStatus: string;
  companions?: number;
  contactNumber?: string;
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

  // Contact number validation (optional, max 20 chars)
  if (data.contactNumber && data.contactNumber.length > 20) {
    errors.push({ field: 'contactNumber', message: 'Contact number must be 20 characters or less' });
  }

  // Dietary restrictions validation
  if (data.dietaryRestrictions && data.dietaryRestrictions.length > 200) {
    errors.push({ field: 'dietaryRestrictions', message: 'Dietary restrictions must be 200 characters or less' });
  }

  return errors;
}
