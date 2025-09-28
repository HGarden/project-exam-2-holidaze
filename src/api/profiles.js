import { holidazeProfiles } from '../constants/apiURL.jsx';
import { get, put } from './client.js';

export const getBookingsForProfile = (name, { token } = {}) =>
  get(`${holidazeProfiles}/${name}/bookings`, { token, params: { _venue: true } });

export const updateProfile = (name, payload, { token } = {}) =>
  put(`${holidazeProfiles}/${name}`, payload, { token });
