import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getWatchlist, addToWatchlist as addWatchlistItem, removeFromWatchlist as removeWatchlistItem } from '../../services/userService';

export const fetchWatchlist = createAsyncThunk(
    'watchlist/fetchWatchlist',
    async (userId, { rejectWithValue }) => {
        try {
            const response = await getWatchlist(userId);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to fetch watchlist');
        }
    }
);

export const addToWatchlist = createAsyncThunk(
    'watchlist/addToWatchlist',
    async ({ userId, movieData }, { rejectWithValue }) => {
        try {
            const response = await addWatchlistItem(userId, movieData);
            return { movieData, response: response.data };
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to add to watchlist');
        }
    }
);

export const removeFromWatchlist = createAsyncThunk(
    'watchlist/removeFromWatchlist',
    async ({ userId, movieId }, { rejectWithValue }) => {
        try {
            await removeWatchlistItem(userId, movieId);
            return { movieId };
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to remove from watchlist');
        }
    }
);

const watchlistSlice = createSlice({
    name: 'watchlist',
    initialState: {
        movies: [],
        loading: false,
        error: null,
    },
    reducers: {
        clearError: (state) => {
            state.error = null;
        },
        addMovieToWatchlist: (state, action) => {
            const movie = action.payload;
            const exists = state.movies.find(m => m.imdbID === movie.imdbID);
            if (!exists) {
                state.movies.push(movie);
            }
        },
        removeMovieFromWatchlist: (state, action) => {
            const movieId = action.payload;
            state.movies = state.movies.filter(m => m.imdbID !== movieId);
        }
    },
    extraReducers: (builder) => {
        builder
            // Fetch watchlist
            .addCase(fetchWatchlist.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchWatchlist.fulfilled, (state, action) => {
                state.loading = false;
                state.movies = action.payload || [];
                state.error = null;
            })
            .addCase(fetchWatchlist.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // Add to watchlist
            .addCase(addToWatchlist.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(addToWatchlist.fulfilled, (state, action) => {
                state.loading = false;
                const movie = action.payload.movieData;
                const exists = state.movies.find(m => m.imdbID === movie.imdbID);
                if (!exists) {
                    state.movies.push(movie);
                }
                state.error = null;
            })
            .addCase(addToWatchlist.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // Remove from watchlist
            .addCase(removeFromWatchlist.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(removeFromWatchlist.fulfilled, (state, action) => {
                state.loading = false;
                state.movies = state.movies.filter(m => m.imdbID !== action.payload.movieId);
                state.error = null;
            })
            .addCase(removeFromWatchlist.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

export const { clearError, addMovieToWatchlist, removeMovieFromWatchlist } = watchlistSlice.actions;
export default watchlistSlice.reducer;
