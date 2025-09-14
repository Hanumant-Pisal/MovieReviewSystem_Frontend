import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { setCredentials } from '../redux/slices/authSlice';
import { API_BASE_URL } from '../utils/apiConfig';

const ProfilePage = () => {
    const { user, isAuthenticated } = useSelector(state => state.auth);
    const dispatch = useDispatch();
    const [isEditing, setIsEditing] = useState(false);
    const [editData, setEditData] = useState({
        username: user?.username || '',
        email: user?.email || ''
    });
    const [editLoading, setEditLoading] = useState(false);
    const [editMessage, setEditMessage] = useState('');
    const [editErrors, setEditErrors] = useState({});
    
    // Admin states
    const [activeTab, setActiveTab] = useState('profile');
    const [users, setUsers] = useState([]);
    const [adminStats, setAdminStats] = useState({
        totalUsers: 0,
        totalReviews: 0,
        totalMovies: 0
    });
    const [loading, setLoading] = useState(false);
    const [newMovie, setNewMovie] = useState({
        title: '',
        genre: '',
        releaseYear: '',
        director: '',
        synopsis: '',
        posterUrl: ''
    });
    
    // User stats states
    const [userStats, setUserStats] = useState({
        reviewsWritten: 0,
        watchlistItems: 0,
        moviesWatched: 0
    });
    const [statsLoading, setStatsLoading] = useState(false);
    
    const isAdmin = user?.role === 'admin';

    const handleLogout = () => {
        // dispatch(logout());
        localStorage.removeItem('token');
        localStorage.removeItem('userId');
        localStorage.removeItem('userRole');
        localStorage.removeItem('userData');
        window.location.href = '/';
    };

    const handleEdit = () => {
        setIsEditing(true);
        setEditData({
            username: user?.username || '',
            email: user?.email || ''
        });
    };

    const handleSave = async () => {
        setEditLoading(true);
        setEditMessage('');
        setEditErrors({});
        
        // Basic validation
        const errors = {};
        if (!editData.username.trim()) {
            errors.username = 'Username is required';
        }
        if (!editData.email.trim()) {
            errors.email = 'Email is required';
        } else if (!/\S+@\S+\.\S+/.test(editData.email)) {
            errors.email = 'Please enter a valid email address';
        }
        
        if (Object.keys(errors).length > 0) {
            setEditErrors(errors);
            setEditLoading(false);
            return;
        }
        
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${API_BASE_URL}/users/${user.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    username: editData.username,
                    email: editData.email
                })
            });
            
            const data = await response.json();
            
            if (response.ok) {
                // Update Redux state with new user data
                const updatedUser = { ...user, username: editData.username, email: editData.email };
                dispatch(setCredentials({ user: updatedUser, token }));
                
                // Update localStorage
                localStorage.setItem('userData', JSON.stringify(updatedUser));
                
                setEditMessage('Profile updated successfully!');
                setIsEditing(false);
                
                // Clear message after 3 seconds
                setTimeout(() => setEditMessage(''), 3000);
            } else {
                setEditMessage(data.message || 'Failed to update profile');
            }
        } catch (error) {
            setEditMessage('Network error. Please try again.');
        } finally {
            setEditLoading(false);
        }
    };

    const handleCancel = () => {
        setIsEditing(false);
        setEditData({
            username: user?.username || '',
            email: user?.email || ''
        });
        setEditErrors({});
        setEditMessage('');
    };

    // Restore user data from localStorage on page refresh
    useEffect(() => {
        const token = localStorage.getItem('token');
        const userData = localStorage.getItem('userData');
        
        if (token && isAuthenticated && !user && userData) {
            try {
                const storedUser = JSON.parse(userData);
                dispatch(setCredentials({ user: storedUser, token }));
            } catch (error) {
                console.error('Error parsing stored user data:', error);
                // If stored data is invalid, clear all auth data
                localStorage.removeItem('token');
                localStorage.removeItem('userId');
                localStorage.removeItem('userRole');
                localStorage.removeItem('userData');
                window.location.href = '/login';
            }
        }
    }, [isAuthenticated, user, dispatch]);
    
    // Fetch admin data when user is admin
    useEffect(() => {
        if (isAdmin) {
            fetchAdminData();
        }
    }, [isAdmin, activeTab]);
    
    // Fetch user stats when user is loaded
    useEffect(() => {
        if (user && !isAdmin) {
            fetchUserStats();
        }
    }, [user, isAdmin]);
    
    const fetchAdminData = async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem('token');
            
            // Always fetch admin stats
            const statsResponse = await fetch(`${API_BASE_URL}/admin/stats`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (statsResponse.ok) {
                const statsData = await statsResponse.json();
                setAdminStats(statsData);
            }
            
            // Fetch users only when on users tab
            if (activeTab === 'users') {
                const response = await fetch(`${API_BASE_URL}/admin/users`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                if (response.ok) {
                    const data = await response.json();
                    setUsers(data.users || []);
                }
            }
        } catch (error) {
            console.error('Failed to fetch admin data:', error);
        } finally {
            setLoading(false);
        }
    };
    
    const handleDeleteUser = async (userId) => {
        if (!confirm('Are you sure you want to delete this user?')) return;
        
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${API_BASE_URL}/admin/users/${userId}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            
            if (response.ok) {
                setUsers(users.filter(u => u._id !== userId));
            }
        } catch (error) {
            console.error('Failed to delete user:', error);
        }
    };
    
    const fetchUserStats = async () => {
        setStatsLoading(true);
        try {
            const token = localStorage.getItem('token');
            
            // Fetch user reviews count
            const reviewsResponse = await fetch(`${API_BASE_URL}/reviews/user/${user.id}`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            
            // Fetch user watchlist count
            const watchlistResponse = await fetch(`${API_BASE_URL}/watchlist/${user.id}`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            
            let reviewsCount = 0;
            let watchlistCount = 0;
            
            if (reviewsResponse.ok) {
                const reviewsData = await reviewsResponse.json();
                reviewsCount = reviewsData.totalReviews || reviewsData.reviews?.length || 0;
            }
            
            if (watchlistResponse.ok) {
                const watchlistData = await watchlistResponse.json();
                watchlistCount = watchlistData.length || 0;
            }
            
            setUserStats({
                reviewsWritten: reviewsCount,
                watchlistItems: watchlistCount,
                moviesWatched: reviewsCount // Assuming movies watched = reviews written for now
            });
        } catch (error) {
            console.error('Failed to fetch user stats:', error);
        } finally {
            setStatsLoading(false);
        }
    };

    const handleAddMovie = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${API_BASE_URL}/movies`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(newMovie)
            });
            
            if (response.ok) {
                setNewMovie({
                    title: '',
                    genre: '',
                    releaseYear: '',
                    director: '',
                    synopsis: '',
                    posterUrl: ''
                });
                alert('Movie added successfully!');
            }
        } catch (error) {
            console.error('Failed to add movie:', error);
        }
    };

    if (!isAuthenticated) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
                <div className="text-center">
                    <div className="text-6xl mb-4">🔒</div>
                    <h2 className="text-2xl font-bold text-white mb-2">Access Denied</h2>
                    <p className="text-gray-400 mb-6">Please log in to view your profile</p>
                    <Link 
                        to="/login" 
                        className="px-6 py-3 bg-gradient-to-r from-pink-500 to-violet-500 rounded-xl text-white font-semibold hover:from-pink-600 hover:to-violet-600 transition-all duration-300"
                    >
                        Go to Login
                    </Link>
                </div>
            </div>
        );
    }

    // Show loading while user data is being fetched
    if (isAuthenticated && !user) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
                <div className="text-center">
                    <div className="relative mb-8">
                        <div className="w-20 h-20 border-4 border-white/20 rounded-full animate-spin">
                            <div className="absolute top-0 left-0 w-20 h-20 border-4 border-transparent border-t-pink-500 border-r-violet-500 rounded-full animate-spin"></div>
                        </div>
                    </div>
                    <p className="text-white text-lg">Loading profile...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
            <div className="container mx-auto px-4 py-8">
               

                <div className="max-w-7xl mx-auto grid lg:grid-cols-3 gap-8">
                    {/* Profile Card */}
                    <div className="lg:col-span-1">
                        <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10 shadow-xl">
                            {/* Avatar */}
                            <div className="text-center mb-6">
                                <div className="w-24 h-24 bg-gradient-to-r from-pink-500 to-violet-500 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <span className="text-3xl text-white font-bold">
                                        {user.username?.charAt(0).toUpperCase() || 'U'}
                                    </span>
                                </div>
                                <h2 className="text-2xl font-bold text-white mb-1">{user.username}</h2>
                                <p className="text-gray-400">{user.email}</p>
  
                                {isAdmin && (
                                    <div className="mt-2">
                                        <span className="px-3 py-1 bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border border-yellow-500/30 rounded-full text-yellow-400 text-sm font-medium">
                                             Admin
                                        </span>
                                    </div>
                                )}
                            </div>

                            {/* Quick Stats - Only for regular users */}
                            {!isAdmin && (
                                <div className="space-y-4">
                                    <div className="flex justify-between items-center p-3 bg-white/5 rounded-xl">
                                        <span className="text-gray-300">Movies Watched</span>
                                        <span className="text-white font-semibold">
                                            {statsLoading ? (
                                                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                            ) : (
                                                userStats.moviesWatched
                                            )}
                                        </span>
                                    </div>
                                    <div className="flex justify-between items-center p-3 bg-white/5 rounded-xl">
                                        <span className="text-gray-300">Reviews Written</span>
                                        <span className="text-white font-semibold">
                                            {statsLoading ? (
                                                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                            ) : (
                                                userStats.reviewsWritten
                                            )}
                                        </span>
                                    </div>
                                    <div className="flex justify-between items-center p-3 bg-white/5 rounded-xl">
                                        <span className="text-gray-300">Watchlist Items</span>
                                        <span className="text-white font-semibold">
                                            {statsLoading ? (
                                                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                            ) : (
                                                userStats.watchlistItems
                                            )}
                                        </span>
                                    </div>
                                </div>
                            )}

                            {/* Navigation Tabs for Admin */}
                            {isAdmin && (
                                <div className="mt-6 space-y-2">
                                    <button
                                        onClick={() => setActiveTab('profile')}
                                        className={`w-full py-2 px-4 rounded-xl font-medium transition-all duration-300 flex items-center justify-center space-x-2 ${
                                            activeTab === 'profile' 
                                                ? 'bg-gradient-to-r from-pink-500 to-violet-500 text-white' 
                                                : 'bg-white/10 text-gray-300 hover:bg-white/20'
                                        }`}
                                    >
                                        <span>👤</span>
                                        <span>Profile</span>
                                    </button>
                                    <button
                                        onClick={() => setActiveTab('users')}
                                        className={`w-full py-2 px-4 rounded-xl font-medium transition-all duration-300 flex items-center justify-center space-x-2 ${
                                            activeTab === 'users' 
                                                ? 'bg-gradient-to-r from-pink-500 to-violet-500 text-white' 
                                                : 'bg-white/10 text-gray-300 hover:bg-white/20'
                                        }`}
                                    >
                                        <span>👥</span>
                                        <span>Manage Users</span>
                                    </button>
                                    <button
                                        onClick={() => setActiveTab('movies')}
                                        className={`w-full py-2 px-4 rounded-xl font-medium transition-all duration-300 flex items-center justify-center space-x-2 ${
                                            activeTab === 'movies' 
                                                ? 'bg-gradient-to-r from-pink-500 to-violet-500 text-white' 
                                                : 'bg-white/10 text-gray-300 hover:bg-white/20'
                                        }`}
                                    >
                                        <span>🎬</span>
                                        <span>Manage Movies</span>
                                    </button>
                                </div>
                            )}
                            
                            {/* Action Buttons */}
                            <div className="mt-6 space-y-3">
                                {!isAdmin && (
                                    <Link
                                        to="/watchlist"
                                        className="w-full py-3 bg-gradient-to-r from-pink-500/20 to-violet-500/20 border border-pink-500/30 rounded-xl text-white font-medium hover:from-pink-500/30 hover:to-violet-500/30 transition-all duration-300 flex items-center justify-center space-x-2"
                                    >
                                        <span>📋</span>
                                        <span>View Watchlist</span>
                                    </Link>
                                )}
                                <button
                                    onClick={handleLogout}
                                    className="w-full py-3 bg-red-500/20 border border-red-500/30 rounded-xl text-red-400 font-medium hover:bg-red-500/30 transition-all duration-300 flex items-center justify-center space-x-2"
                                >
                                    <span>🚪</span>
                                    <span>Logout</span>
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Main Content */}
                    <div className="lg:col-span-2">
                        {activeTab === 'profile' && (
                            <div className="space-y-6">
                                {/* Admin Dashboard Stats */}
                                {isAdmin && (
                                    <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10 shadow-xl">
                                        <div className="flex items-center justify-between mb-6">
                                            <h3 className="text-2xl font-bold text-white flex items-center space-x-2">
                                                <span>📊</span>
                                                <span>Admin Dashboard</span>
                                            </h3>
                                        </div>
                                        
                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                            <div className="bg-gradient-to-br from-blue-500/10 to-cyan-500/10 rounded-xl p-6 border border-blue-500/20">
                                                <div className="flex items-center justify-between">
                                                    <div>
                                                        <p className="text-blue-300 text-sm font-medium mb-1">Total Users</p>
                                                        <p className="text-3xl font-bold text-white">{adminStats.totalUsers}</p>
                                                    </div>
                                                    <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center">
                                                        <span className="text-2xl">👥</span>
                                                    </div>
                                                </div>
                                            </div>
                                            
                                            <div className="bg-gradient-to-br from-green-500/10 to-emerald-500/10 rounded-xl p-6 border border-green-500/20">
                                                <div className="flex items-center justify-between">
                                                    <div>
                                                        <p className="text-green-300 text-sm font-medium mb-1">Total Reviews</p>
                                                        <p className="text-3xl font-bold text-white">{adminStats.totalReviews}</p>
                                                    </div>
                                                    <div className="w-12 h-12 bg-green-500/20 rounded-lg flex items-center justify-center">
                                                        <span className="text-2xl">⭐</span>
                                                    </div>
                                                </div>
                                            </div>
                                            
                                            <div className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 rounded-xl p-6 border border-purple-500/20">
                                                <div className="flex items-center justify-between">
                                                    <div>
                                                        <p className="text-purple-300 text-sm font-medium mb-1">Total Movies</p>
                                                        <p className="text-3xl font-bold text-white">{adminStats.totalMovies}</p>
                                                    </div>
                                                    <div className="w-12 h-12 bg-purple-500/20 rounded-lg flex items-center justify-center">
                                                        <span className="text-2xl">🎬</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}
                                
                                {/* Account Information */}
                                <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10 shadow-xl">
                                    <div className="flex justify-between items-center mb-6">
                                        <h3 className="text-2xl font-bold text-white flex items-center space-x-2">
                                            <span>👤</span>
                                            <span>Account Information</span>
                                        </h3>
                                        {!isEditing && (
                                            <button
                                                onClick={handleEdit}
                                                className="px-4 py-2 bg-gradient-to-r from-pink-500 to-violet-500 rounded-lg text-white font-medium hover:from-pink-600 hover:to-violet-600 transition-all duration-300"
                                            >
                                                Edit Profile
                                            </button>
                                        )}
                                    </div>
                                
                                {editMessage && (
                                    <div className={`mb-4 p-3 rounded-lg ${
                                        editMessage.includes('successfully') 
                                            ? 'bg-green-500/10 border border-green-500/20 text-green-400'
                                            : 'bg-red-500/10 border border-red-500/20 text-red-400'
                                    }`}>
                                        <p className="text-sm">{editMessage}</p>
                                    </div>
                                )}

                            {isEditing ? (
                                <form onSubmit={(e) => { e.preventDefault(); handleSave(); }} className="space-y-6">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-300 mb-2">
                                            Username
                                        </label>
                                        <input
                                            type="text"
                                            value={editData.username}
                                            onChange={(e) => {
                                                setEditData({...editData, username: e.target.value});
                                                if (editErrors.username) {
                                                    setEditErrors({...editErrors, username: ''});
                                                }
                                            }}
                                            className={`w-full px-4 py-3 bg-white/10 border rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-pink-500/50 transition-all duration-300 ${
                                                editErrors.username 
                                                    ? 'border-red-500/50 focus:border-red-500/50' 
                                                    : 'border-white/20 focus:border-pink-500/50'
                                            }`}
                                            disabled={editLoading}
                                        />
                                        {editErrors.username && (
                                            <p className="text-red-400 text-sm mt-1">{editErrors.username}</p>
                                        )}
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-300 mb-2">
                                            Email Address
                                        </label>
                                        <input
                                            type="email"
                                            value={editData.email}
                                            onChange={(e) => {
                                                setEditData({...editData, email: e.target.value});
                                                if (editErrors.email) {
                                                    setEditErrors({...editErrors, email: ''});
                                                }
                                            }}
                                            className={`w-full px-4 py-3 bg-white/10 border rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-pink-500/50 transition-all duration-300 ${
                                                editErrors.email 
                                                    ? 'border-red-500/50 focus:border-red-500/50' 
                                                    : 'border-white/20 focus:border-pink-500/50'
                                            }`}
                                            disabled={editLoading}
                                        />
                                        {editErrors.email && (
                                            <p className="text-red-400 text-sm mt-1">{editErrors.email}</p>
                                        )}
                                    </div>
                                    <div className="flex space-x-4">
                                        <button
                                            type="submit"
                                            disabled={editLoading}
                                            className="px-6 py-3 bg-gradient-to-r from-pink-500 to-violet-500 rounded-xl text-white font-semibold hover:from-pink-600 hover:to-violet-600 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            {editLoading ? (
                                                <div className="flex items-center space-x-2">
                                                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                                    <span>Saving...</span>
                                                </div>
                                            ) : (
                                                'Save Changes'
                                            )}
                                        </button>
                                        <button
                                            type="button"
                                            onClick={handleCancel}
                                            disabled={editLoading}
                                            className="px-6 py-3 bg-white/10 border border-white/20 rounded-xl text-white font-semibold hover:bg-white/20 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            Cancel
                                        </button>
                                    </div>
                                </form>
                            ) : (
                                <div className="space-y-6">
                                    <div className="grid md:grid-cols-2 gap-6">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-400 mb-2">
                                                Username
                                            </label>
                                            <div className="p-4 bg-white/5 rounded-xl">
                                                <p className="text-white font-medium">{user.username}</p>
                                            </div>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-400 mb-2">
                                                Email Address
                                            </label>
                                            <div className="p-4 bg-white/5 rounded-xl">
                                                <p className="text-white font-medium">{user.email}</p>
                                            </div>
                                        </div>
                                    </div>
                                    
                                    <div>
                                        <label className="block text-sm font-medium text-gray-400 mb-2">
                                            Member Since
                                        </label>
                                        <div className="p-4 bg-white/5 rounded-xl">
                                            <p className="text-white font-medium">
                                                {new Date().toLocaleDateString('en-US', { 
                                                    year: 'numeric', 
                                                    month: 'long', 
                                                    day: 'numeric' 
                                                })}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            )}

                                </div>
                            </div>
                        )}
                        
                        {/* Admin Users Management */}
                        {activeTab === 'users' && isAdmin && (
                            <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10 shadow-xl">
                                <h3 className="text-2xl font-bold text-white mb-6">User Management</h3>
                                {loading ? (
                                    <div className="text-center py-8">
                                        <div className="w-8 h-8 border-2 border-white/30 border-t-white rounded-full animate-spin mx-auto mb-4"></div>
                                        <p className="text-gray-400">Loading users...</p>
                                    </div>
                                ) : (
                                    <div className="space-y-4">
                                        {users.map(user => (
                                            <div key={user._id} className="flex items-center justify-between p-4 bg-white/5 rounded-xl border border-white/10">
                                                <div className="flex items-center space-x-4">
                                                    <div className="w-12 h-12 bg-gradient-to-r from-pink-500 to-violet-500 rounded-full flex items-center justify-center">
                                                        <span className="text-white font-bold">{user.username?.charAt(0).toUpperCase()}</span>
                                                    </div>
                                                    <div>
                                                        <h4 className="text-white font-semibold">{user.username}</h4>
                                                        <p className="text-gray-400 text-sm">{user.email}</p>
                                                        <span className={`text-xs px-2 py-1 rounded-full ${
                                                            user.role === 'admin' 
                                                                ? 'bg-yellow-500/20 text-yellow-400' 
                                                                : 'bg-blue-500/20 text-blue-400'
                                                        }`}>
                                                            {user.role || 'user'}
                                                        </span>
                                                    </div>
                                                </div>
                                                <div className="flex items-center space-x-2">
                                                    <button
                                                        onClick={() => handleDeleteUser(user._id)}
                                                        className="px-3 py-1 bg-red-500/20 border border-red-500/30 rounded-lg text-red-400 text-sm hover:bg-red-500/30 transition-all duration-300"
                                                        disabled={user.role === 'admin'}
                                                    >
                                                        Delete
                                                    </button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}
                        
                        {/* Admin Movie Management */}
                        {activeTab === 'movies' && isAdmin && (
                            <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10 shadow-xl">
                                <h3 className="text-2xl font-bold text-white mb-6">Movie Management</h3>
                                
                                {/* Add Movie Form */}
                                <div className="mb-8">
                                    <h4 className="text-lg font-semibold text-white mb-4">Add New Movie</h4>
                                    <form onSubmit={handleAddMovie} className="space-y-4">
                                        <div className="grid md:grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-300 mb-2">Title</label>
                                                <input
                                                    type="text"
                                                    value={newMovie.title}
                                                    onChange={(e) => setNewMovie({...newMovie, title: e.target.value})}
                                                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-pink-500/50"
                                                    required
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-300 mb-2">Genre</label>
                                                <input
                                                    type="text"
                                                    value={newMovie.genre}
                                                    onChange={(e) => setNewMovie({...newMovie, genre: e.target.value})}
                                                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-pink-500/50"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-300 mb-2">Release Year</label>
                                                <input
                                                    type="number"
                                                    value={newMovie.releaseYear}
                                                    onChange={(e) => setNewMovie({...newMovie, releaseYear: e.target.value})}
                                                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-pink-500/50"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-300 mb-2">Director</label>
                                                <input
                                                    type="text"
                                                    value={newMovie.director}
                                                    onChange={(e) => setNewMovie({...newMovie, director: e.target.value})}
                                                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-pink-500/50"
                                                />
                                            </div>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-300 mb-2">Poster URL</label>
                                            <input
                                                type="url"
                                                value={newMovie.posterUrl}
                                                onChange={(e) => setNewMovie({...newMovie, posterUrl: e.target.value})}
                                                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-pink-500/50"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-300 mb-2">Synopsis</label>
                                            <textarea
                                                value={newMovie.synopsis}
                                                onChange={(e) => setNewMovie({...newMovie, synopsis: e.target.value})}
                                                rows={4}
                                                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-pink-500/50"
                                            />
                                        </div>
                                        <button
                                            type="submit"
                                            className="px-6 py-3 bg-gradient-to-r from-pink-500 to-violet-500 rounded-xl text-white font-semibold hover:from-pink-600 hover:to-violet-600 transition-all duration-300"
                                        >
                                            Add Movie
                                        </button>
                                    </form>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProfilePage;
