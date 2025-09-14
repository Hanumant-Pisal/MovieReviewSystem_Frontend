import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { loginUser, registerUser, logoutUser } from '../../services/authService';

// Async thunks
export const loginThunk = createAsyncThunk(
    'auth/login',
    async ({ email, password }, { rejectWithValue }) => {
        try {
            const data = await loginUser(email, password);
            localStorage.setItem('token', data.token);
            localStorage.setItem('userId', data.user.id);
            localStorage.setItem('userRole', data.user.role);
            localStorage.setItem('userData', JSON.stringify(data.user));
            return data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Login failed');
        }
    }
);

export const registerThunk = createAsyncThunk(
    'auth/register',
    async ({ username, email, password }, { rejectWithValue }) => {
        try {
            const data = await registerUser(username, email, password);
            if (data.token && data.user) {
                localStorage.setItem('token', data.token);
                localStorage.setItem('userId', data.user.id);
                localStorage.setItem('userRole', data.user.role);
                localStorage.setItem('userData', JSON.stringify(data.user));
            }
            return data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Registration failed');
        }
    }
);

export const logoutThunk = createAsyncThunk(
    'auth/logout',
    async (_, { rejectWithValue }) => {
        try {
            await logoutUser();
            localStorage.removeItem('token');
            localStorage.removeItem('userId');
            localStorage.removeItem('userRole');
            localStorage.removeItem('userData');
            return null;
        } catch (error) {
            return rejectWithValue('Logout failed');
        }
    }
);

const initialState = {
    user: localStorage.getItem('userData') ? JSON.parse(localStorage.getItem('userData')) : null,
    token: localStorage.getItem('token') || null,
    loading: false,
    error: null,
    isAuthenticated: !!localStorage.getItem('token'),
};

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        clearError: (state) => {
            state.error = null;
        },
        setCredentials: (state, action) => {
            state.user = action.payload.user;
            state.token = action.payload.token;
            state.isAuthenticated = true;
        },
        logout: (state) => {
            state.user = null;
            state.token = null;
            state.isAuthenticated = false;
            localStorage.removeItem('token');
            localStorage.removeItem('userId');
            localStorage.removeItem('userRole');
            localStorage.removeItem('userData');
        },
    },
    extraReducers: (builder) => {
        builder
            // Login
            .addCase(loginThunk.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(loginThunk.fulfilled, (state, action) => {
                state.loading = false;
                state.user = action.payload.user;
                state.token = action.payload.token;
                state.isAuthenticated = true;
                state.error = null;
            })
            .addCase(loginThunk.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
                state.isAuthenticated = false;
            })
            // Register
            .addCase(registerThunk.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(registerThunk.fulfilled, (state, action) => {
                state.loading = false;
                state.user = action.payload.user;
                state.token = action.payload.token;
                state.isAuthenticated = true;
                state.error = null;
            })
            .addCase(registerThunk.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
                state.isAuthenticated = false;
            })
            // Logout
            .addCase(logoutThunk.pending, (state) => {
                state.loading = true;
            })
            .addCase(logoutThunk.fulfilled, (state) => {
                state.loading = false;
                state.user = null;
                state.token = null;
                state.isAuthenticated = false;
                state.error = null;
            })
            .addCase(logoutThunk.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

export const { clearError, setCredentials, logout } = authSlice.actions;
export default authSlice.reducer;
