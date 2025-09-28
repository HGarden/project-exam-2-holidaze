import { authLogin, authRegister } from '../constants/apiURL.jsx';
import { post } from './client.js';

export const login = (payload) => post(authLogin, payload);
export const register = (payload) => post(authRegister, payload);
