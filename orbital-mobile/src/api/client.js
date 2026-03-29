import axios from 'axios';

const client = axios.create({
  baseURL: process.env.EXPO_PUBLIC_API_URL || 'http://192.168.8.127:8000',
});

export default client;
