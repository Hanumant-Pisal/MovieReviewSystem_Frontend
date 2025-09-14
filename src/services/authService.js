import axios from 'axios';
import { API_BASE_URL } from '../utils/apiConfig';

// Login user
export const loginUser = async (email, password) => {
    try {
        const response = await axios.post(`${API_BASE_URL}/auth/login`, {
            email,
            password
        });
        return response.data;
    } catch (error) {
        throw error;
    }
};

// Register user
export const registerUser = async (username, email, password) => {
    try {
        const response = await axios.post(`${API_BASE_URL}/auth/register`, {
            username,
            email,
            password
        });
        return response.data;
    } catch (error) {
        throw error;
    }
};

// Logout user
export const logoutUser = async () => {
    try {
        const token = localStorage.getItem('token');
        const response = await axios.post(`${API_BASE_URL}/auth/logout`, {}, {
            headers: { Authorization: `Bearer ${token}` }
        });
        return response.data;
    } catch (error) {
        throw error;
    }
};

// Get current user profile
export const getCurrentUser = async () => {
    try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`${API_BASE_URL}/auth/me`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        return response.data;
    } catch (error) {
        throw error;
    }
};

// Update user profile
export const updateUserProfile = async (userData) => {
    try {
        const token = localStorage.getItem('token');
        const response = await axios.put(`${API_BASE_URL}/auth/profile`, userData, {
            headers: { Authorization: `Bearer ${token}` }
        });
        return response.data;
    } catch (error) {
        throw error;
    }
};