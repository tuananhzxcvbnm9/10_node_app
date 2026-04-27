import axios from 'axios';

const baseURL = import.meta.env.VITE_API_BASE_URL || '/api/app-04';

export const client = axios.create({
  baseURL,
  withCredentials: true,
  timeout: 10000,
});
