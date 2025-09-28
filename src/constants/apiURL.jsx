// This file is used to store the API URL that is used in the project.
export const apiURL = 'https://v2.api.noroff.dev'

// API Key 
export const NOROFF_API_KEY = 'e002f15b-cc59-40f3-bf4f-62ce78e0f505';

// Helper to build headers consistently
export function withAuthHeaders(token, extra = {}) {
  const headers = { ...extra };
  if (token) headers.Authorization = `Bearer ${token}`;
  headers['X-Noroff-API-Key'] = NOROFF_API_KEY;
  return headers;
}

//Holidaze Profiles API URL
export const holidazeProfiles = '/holidaze/profiles'

//Holidaze Venues API URL
export const holidazeVenues = '/holidaze/venues'


//Holidaze Bookings API URL
export const holidazeBookings = '/holidaze/bookings'

//Authorization API URL
export const authLogin = '/auth/login'
export const authRegister = '/auth/register'

//Search API URL 
export const search = '/holidaze/venues/search?q='