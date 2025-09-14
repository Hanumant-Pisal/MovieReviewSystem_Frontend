import axios from 'axios';
import { API_BASE_URL, OMDB_API_KEY, OMDB_BASE_URL } from '../utils/apiConfig';

// OMDB API Services
export const searchMovies = async (searchTerm, page = 1) => {
    try {
        const response = await axios.get(`${OMDB_BASE_URL}/?s=${searchTerm}&page=${page}&apikey=${OMDB_API_KEY}`);
        return response.data;
    } catch (error) {
        throw new Error('Failed to search movies');
    }
};

export const fetchMovieById = async (imdbID) => {
    try {
        const response = await axios.get(`${OMDB_BASE_URL}/?i=${imdbID}&apikey=${OMDB_API_KEY}`);
        return response.data;
    } catch (error) {
        throw new Error('Failed to fetch movie details');
    }
};

// Backend API Services (for reviews, ratings, etc.)
export const fetchMovies = () =>
    axios.get(`${API_BASE_URL}/movies`);

export const getMovies = async () => {
    try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`${API_BASE_URL}/movies`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        return response.data;
    } catch (error) {
        throw new Error('Failed to fetch movies');
    }
};

export const deleteMovie = async (movieId) => {
    try {
        const token = localStorage.getItem('token');
        const response = await axios.delete(`${API_BASE_URL}/admin/movies/${movieId}`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        return response.data;
    } catch (error) {
        throw new Error('Failed to delete movie');
    }
};

export const getUserReviews = async (userId) => {
    try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`${API_BASE_URL}/reviews/user/${userId}`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        return response.data;
    } catch (error) {
        throw new Error('Failed to fetch user reviews');
    }
};

export const submitReview = (movieId, reviewData) =>
    axios.post(`${API_BASE_URL}/movies/${movieId}/reviews`, reviewData, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    });

// Get trending movies (popular searches)
export const getTrendingMovies = async () => {
    try {
        const trendingSearches = ['batman', 'avengers', 'inception', 'interstellar', 'joker'];
        const randomSearch = trendingSearches[Math.floor(Math.random() * trendingSearches.length)];
        const response = await axios.get(`${OMDB_BASE_URL}/?s=${randomSearch}&apikey=${OMDB_API_KEY}`);
        
        if (response.data.Response === 'True') {
            // Get first 6 movies and fetch detailed info for each
            const movies = response.data.Search.slice(0, 6);
            const detailedMovies = await Promise.all(
                movies.map(async (movie) => {
                    try {
                        const details = await fetchMovieById(movie.imdbID);
                        return details;
                    } catch (error) {
                        return movie; // Return basic info if detailed fetch fails
                    }
                })
            );
            return detailedMovies;
        }
        return [];
    } catch (error) {
        throw new Error('Failed to fetch trending movies');
    }
};