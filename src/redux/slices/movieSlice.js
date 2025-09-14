import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { searchMovies, fetchMovieById as fetchMovieDetails } from '../../services/movieService';

// OMDB API thunks
export const searchMoviesThunk = createAsyncThunk(
    'movies/searchMovies',
    async ({ searchTerm, page = 1 }, { rejectWithValue }) => {
        try {
            const data = await searchMovies(searchTerm, page);
            if (data.Response === 'True') {
                return {
                    movies: data.Search || [],
                    totalResults: parseInt(data.totalResults) || 0,
                    currentPage: page,
                    searchTerm
                };
            } else {
                return rejectWithValue(data.Error || 'No movies found');
            }
        } catch (error) {
            return rejectWithValue('Failed to search movies');
        }
    }
);

export const fetchMovieById = createAsyncThunk(
    'movies/fetchMovieById',
    async (imdbID, { rejectWithValue }) => {
        try {
            const data = await fetchMovieDetails(imdbID);
            if (data.Response === 'True') {
                return data;
            } else {
                return rejectWithValue(data.Error || 'Movie not found');
            }
        } catch (error) {
            return rejectWithValue('Failed to fetch movie details');
        }
    }
);

const movieSlice = createSlice({
    name: 'movies',
    initialState: {
        movies: [],
        selectedMovie: null,
        loading: false,
        error: null,
        totalResults: 0,
        currentPage: 1,
        searchTerm: '',
    },
    reducers: {
        clearError: (state) => {
            state.error = null;
        },
        clearSelectedMovie: (state) => {
            state.selectedMovie = null;
        },
        setSearchTerm: (state, action) => {
            state.searchTerm = action.payload;
        }
    },
    extraReducers: (builder) => {
        builder
            // Search movies
            .addCase(searchMoviesThunk.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(searchMoviesThunk.fulfilled, (state, action) => {
                state.loading = false;
                state.movies = action.payload.movies;
                state.totalResults = action.payload.totalResults;
                state.currentPage = action.payload.currentPage;
                state.searchTerm = action.payload.searchTerm;
                state.error = null;
            })
            .addCase(searchMoviesThunk.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
                state.movies = [];
                state.totalResults = 0;
            })
            // Fetch movie details
            .addCase(fetchMovieById.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchMovieById.fulfilled, (state, action) => {
                state.loading = false;
                state.selectedMovie = action.payload;
                state.error = null;
            })
            .addCase(fetchMovieById.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
                state.selectedMovie = null;
            });
    },
});

export const { clearError, clearSelectedMovie, setSearchTerm } = movieSlice.actions;
export default movieSlice.reducer;
