import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api/v1';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Destination APIs
export const getDestinations = (params) => api.get('/destinations', { params });
export const getFeaturedDestinations = () => api.get('/destinations/featured');
export const getDestination = (idOrSlug) => api.get(`/destinations/${idOrSlug}`);
export const createDestination = (data) => api.post('/destinations', data);
export const updateDestination = (id, data) => api.patch(`/destinations/${id}`, data);
export const deleteDestination = (id) => api.delete(`/destinations/${id}`);

// Package APIs
export const getPackages = (params) => api.get('/packages', { params });
export const getPackage = (idOrSlug) => api.get(`/packages/${idOrSlug}`);
export const getPackageAvailability = (idOrSlug, date) =>
  api.get(`/packages/${idOrSlug}/availability`, { params: { date } });
export const createPackage = (data) => api.post('/packages', data);
export const updatePackage = (id, data) => api.patch(`/packages/${id}`, data);
export const deletePackage = (id) => api.delete(`/packages/${id}`);

// Trip APIs
export const getTrips = (email) => api.get('/trips', { params: { email } });
export const getTrip = (id) => api.get(`/trips/${id}`);
export const createTrip = (data) => api.post('/trips', data);
export const updateTrip = (id, data) => api.patch(`/trips/${id}`, data);
export const deleteTrip = (id) => api.delete(`/trips/${id}`);

// Favorite APIs
export const getFavorites = (email) => api.get('/favorites', { params: { email } });
export const addFavorite = (email, destination) => api.post('/favorites', { email, destination });
export const removeFavorite = (id, email, destination) => {
  if (id) {
    return api.delete(`/favorites/${id}`);
  }
  return api.delete('/favorites', { params: { email, destination } });
};

// Booking APIs
export const getBookings = (email) => api.get('/bookings', { params: { email } });
export const getBooking = (id) => api.get(`/bookings/${id}`);
export const createBooking = (data) => api.post('/bookings', data);
export const cancelBooking = (id) => api.patch(`/bookings/${id}/cancel`);

// Admin APIs
export const getAdminStats = () => api.get('/admin/dashboard/stats');
export const getAdminBookings = (params) => api.get('/admin/bookings', { params });
export const getAdminDestinations = () => api.get('/admin/destinations');
export const getAdminPackages = () => api.get('/admin/packages');

export default api;
