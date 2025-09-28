import { holidazeBookings, holidazeVenues } from '../constants/apiURL.jsx';
import { get, post } from './client.js';

export const getVenue = (id, { token } = {}) =>
  get(`${holidazeVenues}/${id}`, { token, params: { _owner: true, _bookings: true } });

export const createBooking = (payload, { token } = {}) =>
  post(holidazeBookings, payload, { token });
