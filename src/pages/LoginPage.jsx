import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { loginThunk, clearError } from '../redux/slices/authSlice';

const LoginPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { loading, error, isAuthenticated } = useSelector(state => state.auth);

    // Redirect if already authenticated
    if (isAuthenticated) {
        navigate('/');
    }

    const handleLogin = async (e) => {
        e.preventDefault();
        dispatch(clearError());
        
        const result = await dispatch(loginThunk({ email, password }));
        if (result.type === 'auth/login/fulfilled') {
            navigate('/profile');
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4">
            <div className="w-full max-w-md">
              

                {/* Login Form */}
                <div className="bg-white/5 backdrop-blur-sm rounded-3xl p-8 border border-white/10 shadow-2xl">
                    <div className="text-center mb-8">
                        <h2 className="text-3xl font-bold text-white mb-2">Welcome Back</h2>
                        <p className="text-gray-400">Sign in to your account to continue</p>
                    </div>

                    <form onSubmit={handleLogin} className="space-y-6">
                        {/* Error Message */}
                        {error && (
                            <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4">
                                <p className="text-red-400 text-sm">{error}</p>
                            </div>
                        )}

                        {/* Email Field */}
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                Email Address
                            </label>
                            <div className="relative">
                                <input
                                    type="email"
                                    placeholder="Enter your email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-pink-500/50 focus:border-pink-500/50 transition-all duration-300"
                                    required
                                />
                                
                            </div>
                        </div>

                        {/* Password Field */}
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                Password
                            </label>
                            <div className="relative">
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    placeholder="Enter your password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-pink-500/50 focus:border-pink-500/50 transition-all duration-300"
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-3 text-gray-400 hover:text-white transition-colors"
                                >
                                    {showPassword ? 'Hide' : 'Show'}
                                </button>
                            </div>
                        </div>

                       

                        {/* Login Button */}
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-3 bg-gradient-to-r from-pink-500 to-violet-500 rounded-xl font-semibold text-white hover:from-pink-600 hover:to-violet-600 transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                        >
                            {loading ? (
                                <div className="flex items-center justify-center space-x-2">
                                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                    <span>Signing In...</span>
                                </div>
                            ) : (
                                'Sign In'
                            )}
                        </button>
                    </form>

                    {/* Divider */}
                    <div className="my-8 flex items-center">
                        <div className="flex-1 border-t border-white/20"></div>
                        <span className="px-4 text-sm text-gray-400">or</span>
                        <div className="flex-1 border-t border-white/20"></div>
                    </div>

                  

                    {/* Sign Up Link */}
                    <div className="text-center mt-8">
                        <p className="text-gray-400">
                            Don't have an account?{' '}
                            <Link
                                to="/register"
                                className="text-pink-400 hover:text-pink-300 font-semibold transition-colors"
                            >
                                Sign up here
                            </Link>
                        </p>
                    </div>
                </div>

              
            </div>
        </div>
    );
};

export default LoginPage;
