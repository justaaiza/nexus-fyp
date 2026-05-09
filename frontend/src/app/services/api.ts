// ─────────────────────────────────────────────────────────────────────────────
// API Service Layer — Centralized backend communication
// All components should use these functions instead of raw fetch.
// ─────────────────────────────────────────────────────────────────────────────

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// ── Token helpers ─────────────────────────────────────────────────────────────
export const getToken = () => localStorage.getItem('nexus_token');
export const setToken = (token: string) => localStorage.setItem('nexus_token', token);
export const removeToken = () => localStorage.removeItem('nexus_token');

export const getStoredUser = () => {
  try {
    const raw = localStorage.getItem('nexus_user');
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
};
export const setStoredUser = (user: object) => localStorage.setItem('nexus_user', JSON.stringify(user));
export const removeStoredUser = () => localStorage.removeItem('nexus_user');

// ── Core fetch wrapper ────────────────────────────────────────────────────────
async function request<T = unknown>(
  endpoint: string,
  options: RequestInit = {}
): Promise<{ success: boolean; data?: T; message?: string }> {
  const token = getToken();
  const headers: Record<string, string> = {
    ...(options.body && !(options.body instanceof FormData)
      ? { 'Content-Type': 'application/json' }
      : {}),
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(options.headers as Record<string, string> || {}),
  };

  const res = await fetch(`${BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  const json = await res.json();
  if (!res.ok) {
    throw new Error(json.message || 'Something went wrong.');
  }
  return json;
}

// ─────────────────────────────────────────────────────────────────────────────
// AUTH
// ─────────────────────────────────────────────────────────────────────────────
export const authAPI = {
  register: (body: { name: string; email: string; password: string; role: string; rollNumber?: string; department?: string }) =>
    request('/auth/register', { method: 'POST', body: JSON.stringify(body) }),

  login: (body: { email: string; password: string }) =>
    request('/auth/login', { method: 'POST', body: JSON.stringify(body) }),

  me: () => request('/auth/me'),
};

// ─────────────────────────────────────────────────────────────────────────────
// NOTIFICATIONS
// ─────────────────────────────────────────────────────────────────────────────
export const notificationAPI = {
  getNotifications: () => request('/notifications'),
  markAsRead: (id: string) => request(`/notifications/${id}/read`, { method: 'POST' }),
  markAllAsRead: () => request('/notifications/read-all', { method: 'POST' }),
};

// ─────────────────────────────────────────────────────────────────────────────
// STUDENT
// ─────────────────────────────────────────────────────────────────────────────
export const studentAPI = {
  submitProposal: (body: object) =>
    request('/student/proposals', { method: 'POST', body: JSON.stringify(body) }),

  getMyProposal: () => request('/student/proposals/me'),
  getProposalOptions: () => request('/student/proposals/options'),
  updateProposal: (id: string, body: object) => request(`/student/proposals/${id}`, { method: 'PUT', body: JSON.stringify(body) }),

  getMilestones: () => request('/student/milestones'),

  submitDeliverable: (milestoneId: string, file: File) => {
    const form = new FormData();
    form.append('file', file);
    return request(`/student/milestones/${milestoneId}/submit`, { method: 'POST', body: form });
  },

  getMySubmissions: () => request('/student/submissions/me'),

  deleteSubmission: (submissionId: string) =>
    request(`/student/submissions/${submissionId}`, { method: 'DELETE' }),

  getMyFeedback: () => request('/student/feedback/me'),

  getProfile: () => request('/student/profile'),

  updateProfile: (body: { name?: string; rollNumber?: string; department?: string }) =>
    request('/student/profile', { method: 'PUT', body: JSON.stringify(body) }),
};

// ─────────────────────────────────────────────────────────────────────────────
// ADMIN
// ─────────────────────────────────────────────────────────────────────────────
export const adminAPI = {
  getStats: () => request('/admin/stats'),

  getUsers: (role?: string) =>
    request(`/admin/users${role ? `?role=${role}` : ''}`),

  approveUser: (id: string) =>
    request(`/admin/users/${id}/approve`, { method: 'PATCH' }),

  rejectUser: (id: string) =>
    request(`/admin/users/${id}/reject`, { method: 'PATCH' }),

  deleteUser: (id: string) =>
    request(`/admin/users/${id}`, { method: 'DELETE' }),

  getProposals: (status?: string) =>
    request(`/admin/proposals${status ? `?status=${status}` : ''}`),

  approveProposal: (id: string) =>
    request(`/admin/proposals/${id}/approve`, { method: 'PATCH' }),

  rejectProposal: (id: string, reason?: string) =>
    request(`/admin/proposals/${id}/reject`, { method: 'PATCH', body: JSON.stringify({ reason }) }),

  createPanel: (body: object) =>
    request('/admin/panels', { method: 'POST', body: JSON.stringify(body) }),

  getPanels: () => request('/admin/panels'),

  updatePanel: (id: string, body: object) =>
    request(`/admin/panels/${id}`, { method: 'PUT', body: JSON.stringify(body) }),

  deletePanel: (id: string) =>
    request(`/admin/panels/${id}`, { method: 'DELETE' }),

  getAnnouncements: () => request('/admin/announcements'),

  createAnnouncement: (body: { title: string; content: string; audience?: string; type?: string }) =>
    request('/admin/announcements', { method: 'POST', body: JSON.stringify(body) }),

  togglePin: (id: string) =>
    request(`/admin/announcements/${id}/pin`, { method: 'PATCH' }),

  deleteAnnouncement: (id: string) =>
    request(`/admin/announcements/${id}`, { method: 'DELETE' }),
};

// ─────────────────────────────────────────────────────────────────────────────
// SUPERVISOR
// ─────────────────────────────────────────────────────────────────────────────
export const supervisorAPI = {
  getRequests: () => request('/supervisor/requests'),
  acceptRequest: (id: string) => request(`/supervisor/requests/${id}/accept`, { method: 'PATCH' }),
  rejectRequest: (id: string) => request(`/supervisor/requests/${id}/reject`, { method: 'PATCH' }),
  
  createMilestone: (body: object) => request('/supervisor/milestones', { method: 'POST', body: JSON.stringify(body) }),
  getMilestones: () => request('/supervisor/milestones'),
  updateMilestone: (id: string, body: object) => request(`/supervisor/milestones/${id}`, { method: 'PUT', body: JSON.stringify(body) }),
  deleteMilestone: (id: string) => request(`/supervisor/milestones/${id}`, { method: 'DELETE' }),
  
  getSubmissions: () => request('/supervisor/submissions'),
  getSubmissionById: (id: string) => request(`/supervisor/submissions/${id}`),
  
  submitFeedback: (submissionId: string, body: object) => request(`/supervisor/submissions/${submissionId}/feedback`, { method: 'POST', body: JSON.stringify(body) }),
  getFeedback: (submissionId: string) => request(`/supervisor/submissions/${submissionId}/feedback`),
  
  getProfile: () => request('/supervisor/profile'),
  updateProfile: (body: object) => request('/supervisor/profile', { method: 'PUT', body: JSON.stringify(body) }),
};

// ─────────────────────────────────────────────────────────────────────────────
// JURY
// ─────────────────────────────────────────────────────────────────────────────
export const juryAPI = {
  getMyPanels: () => request('/jury/panels/me'),
  getPanelGroups: (panelId: string) => request(`/jury/panels/${panelId}/groups`),
  
  getGroupSubmissions: (groupId: string) => request(`/jury/submissions/${groupId}`),
  getSubmissionFile: (submissionId: string) => request(`/jury/submissions/${submissionId}/file`),
  
  submitGrade: (submissionId: string, body: object) => request(`/jury/submissions/${submissionId}/grade`, { method: 'POST', body: JSON.stringify(body) }),
  getMyGrade: (submissionId: string) => request(`/jury/submissions/${submissionId}/grade`),
  
  getProfile: () => request('/jury/profile'),
  updateProfile: (body: object) => request('/jury/profile', { method: 'PUT', body: JSON.stringify(body) }),
};
