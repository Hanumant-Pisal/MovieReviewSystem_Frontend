import { Link, useLocation } from 'react-router-dom';
import { useState } from 'react';
import { useSelector } from 'react-redux';
import { CgProfile } from "react-icons/cg";

const Header = () => {
    const location = useLocation();
    const { isAuthenticated } = useSelector(state => state.auth);
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const isActive = (path) => location.pathname === path;

    const navLinks = [
        { path: '/', label: 'Home'},
        { path: '/movies', label: 'Movies'},
        { path: '/about', label: 'About'},
        ...(isAuthenticated ? [
            { path: '/watchlist', label: 'Watchlist'}
        ] : [])
    ];

    return (
        <header className="bg-gradient-to-r from-purple-900 via-blue-900 to-indigo-900 text-white shadow-2xl sticky top-0 z-50 backdrop-blur-sm">
            <div className="container mx-auto px-4 py-4">
                <div className="flex justify-between items-center">
                    {/* Logo */}
                    <Link to="/" className="flex items-center space-x-3 group">
                        <div className="bg-gradient-to-r from-pink-500 to-violet-500 p-2 rounded-xl group-hover:scale-110 transition-transform duration-300">
                            <span className="text-2xl">🎭</span>
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold bg-gradient-to-r from-pink-400 to-violet-400 bg-clip-text text-transparent">
                                MovieReviewSystem
                            </h1>
                            <p className="text-xs text-gray-300">Discover & Review</p>
                        </div>
                    </Link>

                    {/* Desktop Navigation & Auth Buttons */}
                    <div className="hidden md:flex items-center space-x-3">
                        {/* Navigation Links */}
                        <nav className="flex items-center space-x-3">
                            {navLinks.map((link) => (
                                <Link
                                    key={link.path}
                                    to={link.path}
                                    className={`flex items-center space-x-2 px-4 py-2 rounded-xl transition-all duration-300 hover:bg-white/10 ${
                                        isActive(link.path) 
                                            ? 'bg-white/20 text-white shadow-lg' 
                                            : 'text-gray-300 hover:text-white'
                                    }`}
                                >
                                    <span className="font-medium">{link.label}</span>
                                </Link>
                            ))}
                        </nav>

                        {/* Auth Buttons */}
                        <div className="flex items-center space-x-3">
                            {!isAuthenticated ? (
                            <>
                                <Link
                                    to="/login"
                                    className="px-4 py-2 text-gray-300 hover:text-white transition-colors duration-300"
                                >
                                    Sign In
                                </Link>
                                <Link
                                    to="/register"
                                    className="px-6 py-2 bg-gradient-to-r from-pink-500 to-violet-500 rounded-xl font-medium hover:from-pink-600 hover:to-violet-600 transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105"
                                >
                                    Sign Up
                                </Link>
                            </>
                        ) : (
                            <div className="flex items-center space-x-3">
                                <Link
                                    to="/profile"
                                    className="flex items-center space-x-2 px-4 py-2 bg-white/10 rounded-xl hover:bg-white/20 transition-all duration-300"
                                >
                                    <div className="w-8 h-8 bg-gradient-to-r from-pink-500 to-violet-500 rounded-full flex items-center justify-center">
                                        <span className="text-white text-sm font-bold">
                                            {/* {user?.username?.charAt(0).toUpperCase() || 'U'} */}
                                            <CgProfile />
                                        </span>
                                    </div>
                                    <span className="text-white font-medium">Profile</span>
                                </Link>
                            </div>
                        )}
                        </div>
                    </div>

                    {/* Mobile Menu Button */}
                    <button
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                        className="md:hidden p-2 rounded-lg hover:bg-white/10 transition-colors duration-300"
                    >
                        <div className="space-y-1">
                            <div className={`w-6 h-0.5 bg-white transition-transform duration-300 ${isMenuOpen ? 'rotate-45 translate-y-1.5' : ''}`}></div>
                            <div className={`w-6 h-0.5 bg-white transition-opacity duration-300 ${isMenuOpen ? 'opacity-0' : ''}`}></div>
                            <div className={`w-6 h-0.5 bg-white transition-transform duration-300 ${isMenuOpen ? '-rotate-45 -translate-y-1.5' : ''}`}></div>
                        </div>
                    </button>
                </div>

                {/* Mobile Navigation */}
                {isMenuOpen && (
                    <div className="md:hidden mt-4 pb-4 border-t border-white/20">
                        <nav className="flex flex-col space-y-2 mt-4">
                            {navLinks.map((link) => (
                                <Link
                                    key={link.path}
                                    to={link.path}
                                    onClick={() => setIsMenuOpen(false)}
                                    className={`flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-300 ${
                                        isActive(link.path) 
                                            ? 'bg-white/20 text-white' 
                                            : 'text-gray-300 hover:text-white hover:bg-white/10'
                                    }`}
                                >
                                    <span className="font-medium">{link.label}</span>
                                </Link>
                            ))}
                            {!isAuthenticated && (
                                <div className="flex flex-col space-y-2 mt-4 pt-4 border-t border-white/20">
                                    <Link
                                        to="/login"
                                        onClick={() => setIsMenuOpen(false)}
                                        className="px-4 py-2 text-center text-gray-300 hover:text-white transition-colors duration-300"
                                    >
                                        Sign In
                                    </Link>
                                    <Link
                                        to="/register"
                                        onClick={() => setIsMenuOpen(false)}
                                        className="px-4 py-2 bg-gradient-to-r from-pink-500 to-violet-500 rounded-xl font-medium text-center hover:from-pink-600 hover:to-violet-600 transition-all duration-300"
                                    >
                                        Sign Up
                                    </Link>
                                </div>
                            )}
                        </nav>
                    </div>
                )}
            </div>
        </header>
    );
};

export default Header;
