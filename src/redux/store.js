import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import movieReducer from './slices/movieSlice';
import userReducer from './slices/userSlice';
import watchlistReducer from './slices/watchlistSlice';

const store = configureStore({
    reducer: {
        auth: authReducer,
        movies: movieReducer,
        user: userReducer,
        watchlist: watchlistReducer,
    },
});

export default store;
