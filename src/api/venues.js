import { holidazeProfiles, holidazeVenues } from '../constants/apiURL.jsx';
import { get, post, put, del } from './client.js';

export const listVenues = ({ token, params } = {}) =>
  get(holidazeVenues, { token, params });

export const searchVenues = (q, { token, params } = {}) =>
  get(`${holidazeVenues}/search`, { token, params: { q, ...(params || {}) } });

export const listMyVenues = (name, { token, params } = {}) =>
  get(`${holidazeProfiles}/${name}/venues`, { token, params });

export const createVenue = (payload, { token } = {}) =>
  post(holidazeVenues, payload, { token });

export const updateVenue = (id, payload, { token } = {}) =>
  put(`${holidazeVenues}/${id}`, payload, { token });

export const deleteVenue = (id, { token } = {}) =>
  del(`${holidazeVenues}/${id}`, { token });

export const getVenueWithBookings = (id, { token } = {}) =>
  get(`${holidazeVenues}/${id}`, { token, params: { _bookings: true } });
