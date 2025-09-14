import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { API_BASE_URL } from '../utils/apiConfig';
import LoadingSpinner from '../components/LoadingSpinner';
import MovieCard from '../components/MovieCard';

const WatchlistPage = () => {
    const { user, isAuthenticated } = useSelector(state => state.auth);
    const [movies, setMovies] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [sortBy, setSortBy] = useState('dateAdded');

    useEffect(() => {
        const fetchWatchlist = async () => {
            if (!isAuthenticated || !user) {
                setLoading(false);
                return;
            }

            try {
                const token = localStorage.getItem('token');
                const response = await fetch(`${API_BASE_URL}/watchlist/${user.id}`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });

                if (response.ok) {
                    const data = await response.json();
                    setMovies(data);
                } else {
                    setError('Failed to fetch watchlist');
                }
            } catch (err) {
                setError('Network error. Please try again.');
            } finally {
                setLoading(false);
            }
        };

        fetchWatchlist();
    }, [user, isAuthenticated]);

    const handleRemove = async (imdbId) => {
        if (!user) return;

        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${API_BASE_URL}/watchlist/${user.id}/${imdbId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.ok) {
                setMovies(movies.filter(movie => movie.imdbId !== imdbId));
            } else {
                setError('Failed to remove movie from watchlist');
            }
        } catch (err) {
            setError('Network error. Please try again.');
        }
    };

    // Transform movies data to match MovieCard expectations
    const transformedMovies = movies.map(movie => ({
        ...movie,
        Title: movie.movieTitle,
        Year: movie.movieYear,
        Poster: movie.moviePoster,
        imdbID: movie.imdbId,
        imdbRating: movie.rating || 'N/A',
        Genre: movie.genre || 'N/A',
        Type: 'movie'
    }));

    // Sort movies
    const sortedMovies = [...transformedMovies].sort((a, b) => {
        switch (sortBy) {
            case 'title':
                return a.Title.localeCompare(b.Title);
            case 'rating':
                return (parseFloat(b.imdbRating) || 0) - (parseFloat(a.imdbRating) || 0);
            case 'year':
                return (parseInt(b.Year) || 0) - (parseInt(a.Year) || 0);
            case 'dateAdded':
            default:
                return new Date(b.dateAdded || '2024-01-01') - new Date(a.dateAdded || '2024-01-01');
        }
    });

    if (loading) return <LoadingSpinner />;

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
            <div className="container mx-auto px-4 py-8">
               

                {error && (
                    <div className="bg-red-500/10 border border-red-500/20 rounded-2xl p-6 mb-8 text-center">
                        <div className="text-4xl mb-2">⚠️</div>
                        <h3 className="text-xl font-bold text-red-400 mb-2">Error Loading Watchlist</h3>
                        <p className="text-red-300">{error}</p>
                    </div>
                )}

                {sortedMovies.length > 0 ? (
                    <>
                        {/* Controls */}
                        <div className="flex flex-col sm:flex-row justify-between items-center mb-8 gap-4">
                            <div className="flex items-center space-x-4">
                                <span className="text-gray-300">
                                    <span className="text-white font-semibold">{sortedMovies.length}</span> movies in your watchlist
                                </span>
                            </div>
                            
                            <div className="flex items-center space-x-4">
                                <label className="text-gray-300 text-sm">Sort by:</label>
                                <select
                                    value={sortBy}
                                    onChange={(e) => setSortBy(e.target.value)}
                                    className="px-4 py-2 bg-white/10 border border-white/20 rounded-xl text-white text-sm focus:outline-none focus:ring-2 focus:ring-pink-500/50 focus:border-pink-500/50 transition-all duration-300"
                                >
                                    <option value="dateAdded" className="bg-gray-800">Date Added</option>
                                    <option value="title" className="bg-gray-800">Title</option>
                                    <option value="rating" className="bg-gray-800">Rating</option>
                                    <option value="year" className="bg-gray-800">Year</option>
                                </select>
                            </div>
                        </div>

                        {/* Movies Grid */}
                        <div className="grid sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-4">
                            {sortedMovies.map(movie => (
                                <MovieCard 
                                    key={movie._id || movie.imdbId} 
                                    movie={movie} 
                                    showActions={true}
                                    onRemove={handleRemove}
                                />
                            ))}
                        </div>

                        {/* Stats */}
                        <div className="mt-16 bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10">
                            <h3 className="text-2xl font-bold text-white mb-6 text-center">Your Watchlist Stats</h3>
                            <div className="grid md:grid-cols-3 gap-6">
                                <div className="text-center">
                                    <div className="text-3xl font-bold text-pink-400 mb-2">{sortedMovies.length}</div>
                                    <div className="text-gray-300">Total Movies</div>
                                </div>
                                <div className="text-center">
                                    <div className="text-3xl font-bold text-violet-400 mb-2">
                                        {Math.round((sortedMovies.reduce((sum, movie) => sum + (parseFloat(movie.imdbRating) || 0), 0) / sortedMovies.length) * 10) / 10 || 0}
                                    </div>
                                    <div className="text-gray-300">Average Rating</div>
                                </div>
                                <div className="text-center">
                                    <div className="text-3xl font-bold text-blue-400 mb-2">
                                        {[...new Set(sortedMovies.map(movie => movie.Genre).filter(g => g && g !== 'N/A'))].length}
                                    </div>
                                    <div className="text-gray-300">Genres</div>
                                </div>
                            </div>
                        </div>
                    </>
                ) : (
                    /* Empty State */
                    <div className="text-center py-20">
                        <div className="text-8xl mb-6">📋</div>
                        <h3 className="text-3xl font-bold text-white mb-4">Your Watchlist is Empty</h3>
                        <p className="text-xl text-gray-400 mb-8 max-w-md mx-auto">
                            Start building your watchlist by adding movies you want to watch
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <a
                                href="/movies"
                                className="px-8 py-4 bg-gradient-to-r from-pink-500 to-violet-500 rounded-2xl font-semibold text-white hover:from-pink-600 hover:to-violet-600 transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105"
                            >
                                🎬 Discover Movies
                            </a>
                            <a
                                href="/"
                                className="px-8 py-4 border-2 border-white/20 rounded-2xl font-semibold text-white hover:bg-white/10 transition-all duration-300 backdrop-blur-sm"
                            >
                                Back to Home
                            </a>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default WatchlistPage;
