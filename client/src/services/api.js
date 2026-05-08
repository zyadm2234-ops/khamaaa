import axios from 'axios';
import { API_BASE_URL } from '../data/constants';

const api = axios.create({
  baseURL: API_BASE_URL,
});

export const createOrder = async (orderData) => {
  try {
    const response = await api.post('/orders', orderData);
    return response.data;
  } catch (error) {
    console.error('Error creating order:', error);
    throw error;
  }
};

export const getOrder = async (invoiceId) => {
  try {
    const response = await api.get(`/orders/${invoiceId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching order:', error);
    throw error;
  }
};

export default api;
