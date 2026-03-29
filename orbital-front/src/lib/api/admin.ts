// Admin API client
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export interface User {
  id: number;
  full_name: string | null;
  email: string;
  role: 'OBSERVER' | 'OPERATOR' | 'ADMIN';
  is_active: boolean;
  created_at: string;
}

export interface Alert {
  id: number;
  title: string;
  message: string;
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  threat_type: string | null;
  affected_users: number;
  is_global: boolean;
  created_at: string;
}

export interface APIHealthStatus {
  noaa_swpc: {
    status: 'healthy' | 'degraded' | 'down' | 'unknown';
    latency_ms: number;
    endpoints: {
      plasma: boolean;
      mag: boolean;
      kp_index: boolean;
    };
  };
  nasa_donki: {
    status: 'healthy' | 'degraded' | 'down' | 'unknown';
    latency_ms: number;
    endpoints: {
      cme: boolean;
      flare: boolean;
    };
  };
}

export async function fetchAllUsers(): Promise<User[]> {
  const response = await fetch(`${API_BASE_URL}/api/v1/admin/users`);
  if (!response.ok) {
    throw new Error('Failed to fetch users');
  }
  return response.json();
}

export async function fetchPendingUsers(): Promise<User[]> {
  const response = await fetch(`${API_BASE_URL}/api/v1/admin/users/pending`);
  if (!response.ok) {
    throw new Error('Failed to fetch pending users');
  }
  return response.json();
}

export async function updateUser(userId: number, updates: { is_active?: boolean; role?: string }): Promise<User> {
  const response = await fetch(`${API_BASE_URL}/api/v1/admin/users/${userId}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(updates),
  });
  if (!response.ok) {
    throw new Error('Failed to update user');
  }
  return response.json();
}

export async function fetchAPIHealth(): Promise<APIHealthStatus> {
  const response = await fetch(`${API_BASE_URL}/api/v1/admin/api-health`);
  if (!response.ok) {
    throw new Error('Failed to fetch API health');
  }
  return response.json();
}

export async function fetchAlerts(limit: number = 50): Promise<Alert[]> {
  const response = await fetch(`${API_BASE_URL}/api/v1/admin/alerts?limit=${limit}`);
  if (!response.ok) {
    throw new Error('Failed to fetch alerts');
  }
  return response.json();
}

export async function createAlert(alert: {
  title: string;
  message: string;
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  threat_type?: string;
  affected_users?: number;
  is_global?: boolean;
}): Promise<Alert> {
  const response = await fetch(`${API_BASE_URL}/api/v1/admin/alerts`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(alert),
  });
  if (!response.ok) {
    throw new Error('Failed to create alert');
  }
  return response.json();
}
