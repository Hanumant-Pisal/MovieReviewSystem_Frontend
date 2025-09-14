import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getUserProfile, updateUserProfile, getUserReviews } from '../../services/userService';

// Async thunks
export const fetchUserProfile = createAsyncThunk(
    'user/fetchProfile',
    async (userId, { rejectWithValue }) => {
        try {
            const response = await getUserProfile(userId);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to fetch user profile');
        }
    }
);

export const updateProfile = createAsyncThunk(
    'user/updateProfile',
    async ({ userId, userData }, { rejectWithValue }) => {
        try {
            const response = await updateUserProfile(userId, userData);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to update profile');
        }
    }
);

export const fetchUserReviews = createAsyncThunk(
    'user/fetchReviews',
    async (userId, { rejectWithValue }) => {
        try {
            const response = await getUserReviews(userId);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to fetch user reviews');
        }
    }
);

const userSlice = createSlice({
    name: 'user',
    initialState: {
        profile: null,
        reviews: [],
        loading: false,
        error: null,
    },
    reducers: {
        setProfile: (state, action) => {
            state.profile = action.payload;
        },
        clearError: (state) => {
            state.error = null;
        },
        addReview: (state, action) => {
            state.reviews.unshift(action.payload);
        },
        updateReview: (state, action) => {
            const index = state.reviews.findIndex(r => r._id === action.payload._id);
            if (index !== -1) {
                state.reviews[index] = action.payload;
            }
        },
        deleteReview: (state, action) => {
            state.reviews = state.reviews.filter(r => r._id !== action.payload);
        }
    },
    extraReducers: (builder) => {
        builder
            // Fetch user profile
            .addCase(fetchUserProfile.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchUserProfile.fulfilled, (state, action) => {
                state.loading = false;
                state.profile = action.payload;
                state.error = null;
            })
            .addCase(fetchUserProfile.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // Update profile
            .addCase(updateProfile.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateProfile.fulfilled, (state, action) => {
                state.loading = false;
                state.profile = action.payload;
                state.error = null;
            })
            .addCase(updateProfile.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // Fetch user reviews
            .addCase(fetchUserReviews.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchUserReviews.fulfilled, (state, action) => {
                state.loading = false;
                state.reviews = action.payload;
                state.error = null;
            })
            .addCase(fetchUserReviews.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

export const { setProfile, clearError, addReview, updateReview, deleteReview } = userSlice.actions;
export default userSlice.reducer;
