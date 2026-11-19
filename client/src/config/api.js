const rawUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';
const cleanUrl = rawUrl.replace(/\/+$/, '');

export const API_URL = cleanUrl.endsWith('/api') ? cleanUrl : `${cleanUrl}/api`;
