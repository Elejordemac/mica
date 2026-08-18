const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

export interface Guest {
  id: string;
  name: string;
  contactNumber?: string;
  rsvpStatus: string;
  approvalStatus: string;
  companions: number;
  dietaryRestrictions?: string;
  submittedAt: string;
  updatedAt?: string;
}

export interface GuestListResponse {
  guests: Guest[];
  counts: {
    attending: number;
    notAttending: number;
    total: number;
  };
}

export interface RegisterData {
  name: string;
  rsvpStatus: string;
  companions: number;
  contactNumber: string;
  dietaryRestrictions: string;
}

export interface ValidationError {
  field: string;
  message: string;
}

export interface ApiError {
  error?: string;
  errors?: ValidationError[];
}

// Public endpoints
export async function fetchGuests(): Promise<GuestListResponse> {
  const res = await fetch(`${API_URL}/api/guests`);
  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.error || 'Failed to fetch guests');
  }
  return res.json();
}

export async function registerGuest(data: RegisterData): Promise<{ message: string; guest: Guest }> {
  const res = await fetch(`${API_URL}/api/guests`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });

  const responseData = await res.json();

  if (!res.ok) {
    throw { status: res.status, ...responseData };
  }

  return responseData;
}

// Auth
export async function login(password: string): Promise<string> {
  const res = await fetch(`${API_URL}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ password }),
  });

  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.error || 'Login failed');
  }

  const data = await res.json();
  return data.token;
}

// Admin endpoints
function authHeaders(token: string) {
  return {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`,
  };
}

export async function fetchAdminGuests(
  token: string,
  status?: string,
  search?: string
): Promise<GuestListResponse> {
  const params = new URLSearchParams();
  if (status && status !== 'all') params.set('status', status);
  if (search) params.set('search', search);

  const url = `${API_URL}/api/admin/guests${params.toString() ? '?' + params.toString() : ''}`;
  const res = await fetch(url, { headers: authHeaders(token) });

  if (res.status === 401) throw new Error('Unauthorized');
  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.error || 'Failed to fetch guests');
  }

  return res.json();
}

export async function updateGuest(
  token: string,
  id: string,
  data: { name: string; rsvpStatus: string; contactNumber: string }
): Promise<void> {
  const res = await fetch(`${API_URL}/api/admin/guests/${id}`, {
    method: 'PUT',
    headers: authHeaders(token),
    body: JSON.stringify(data),
  });

  if (res.status === 401) throw new Error('Unauthorized');
  if (!res.ok) {
    const responseData = await res.json().catch(() => ({}));
    throw new Error(responseData.error || 'Failed to update guest');
  }
}

export async function deleteGuest(token: string, id: string): Promise<void> {
  const res = await fetch(`${API_URL}/api/admin/guests/${id}`, {
    method: 'DELETE',
    headers: authHeaders(token),
  });

  if (res.status === 401) throw new Error('Unauthorized');
  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.error || 'Failed to delete guest');
  }
}

export async function approveGuest(token: string, id: string): Promise<void> {
  const res = await fetch(`${API_URL}/api/admin/guests/${id}/approve`, {
    method: 'POST',
    headers: authHeaders(token),
  });

  if (res.status === 401) throw new Error('Unauthorized');
  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.error || 'Failed to approve guest');
  }
}
