import axios from 'axios';
import { API_BASE_URL } from '../utils/apiConfig';

// Get user watchlist
export const getWatchlist = async (userId) => {
    try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`${API_BASE_URL}/users/${userId}/watchlist`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        return response.data;
    } catch (error) {
        throw error;
    }
};

// Add movie to watchlist
export const addToWatchlist = async (userId, movieData) => {
    try {
        const token = localStorage.getItem('token');
        const response = await axios.post(`${API_BASE_URL}/users/${userId}/watchlist`, {
            movieData
        }, {
            headers: { Authorization: `Bearer ${token}` }
        });
        return response.data;
    } catch (error) {
        throw error;
    }
};

// Remove movie from watchlist
export const removeFromWatchlist = async (userId, movieId) => {
    try {
        const token = localStorage.getItem('token');
        const response = await axios.delete(`${API_BASE_URL}/users/${userId}/watchlist/${movieId}`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        return response.data;
    } catch (error) {
        throw error;
    }
};

// Get user profile
export const getUserProfile = async (userId) => {
    try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`${API_BASE_URL}/users/${userId}`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        return response.data;
    } catch (error) {
        throw error;
    }
};

// Update user profile
export const updateUserProfile = async (userId, userData) => {
    try {
        const token = localStorage.getItem('token');
        const response = await axios.put(`${API_BASE_URL}/users/${userId}`, userData, {
            headers: { Authorization: `Bearer ${token}` }
        });
        return response.data;
    } catch (error) {
        throw error;
    }
};

// Get user reviews
export const getUserReviews = async (userId) => {
    try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`${API_BASE_URL}/users/${userId}/reviews`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        return response.data;
    } catch (error) {
        throw error;
    }
};