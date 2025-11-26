const API_BASE = '/api/auth';

const handleResponse = async (response) => {
  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    const error = data?.error || 'Request failed';
    throw new Error(error);
  }
  return data;
};

export const authService = {
  async login(email, password) {
    const response = await fetch(`${API_BASE}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    const data = await handleResponse(response);
    localStorage.setItem('user', JSON.stringify(data.user));
    return data.user;
  },

  async register(username, email, password) {
    const response = await fetch(`${API_BASE}/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, email, password }),
    });
    const data = await handleResponse(response);
    localStorage.setItem('user', JSON.stringify(data.user));
    return data.user;
  },

  logout() {
    localStorage.removeItem('user');
  },

  getCurrentUser() {
    try {
      const stored = localStorage.getItem('user');
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  },
};

