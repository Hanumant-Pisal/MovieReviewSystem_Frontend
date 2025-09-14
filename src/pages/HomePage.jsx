import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { getTrendingMovies } from '../services/movieService';

const HomePage = () => {
    const [trendingMovies, setTrendingMovies] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    

    useEffect(() => {
        const fetchTrendingMovies = async () => {
            try {
                setLoading(true);
                setError(null);
                const movies = await getTrendingMovies();
                setTrendingMovies(movies.slice(0, 5));
            } catch (err) {
                setError('Failed to load trending movies');
                console.error('Error fetching trending movies:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchTrendingMovies();
    }, []);

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
            {/* Hero Section */}
            <section className="relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-purple-900/50 to-blue-900/50"></div>
                <div className="relative container mx-auto px-4 py-20 text-center">
                    <div className="max-w-4xl mx-auto">
                        <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-pink-400 via-purple-400 to-indigo-400 bg-clip-text text-transparent">
                            Discover Your Next
                            <br />
                            <span className="text-white">Favorite Movie</span>
                        </h1>
                        <p className="text-xl md:text-2xl text-gray-300 mb-8 leading-relaxed">
                            Join millions of movie lovers. Rate, review, and discover incredible films from around the world.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                            <Link
                                to="/movies"
                                className="px-8 py-4 bg-gradient-to-r from-pink-500 to-violet-500 rounded-2xl font-semibold text-lg hover:from-pink-600 hover:to-violet-600 transition-all duration-300 shadow-2xl hover:shadow-pink-500/25 hover:scale-105"
                            >
                                 Explore Movies
                            </Link>
                            <Link
                                to="/register"
                                className="px-8 py-4 border-2 border-white/20 rounded-2xl font-semibold text-lg hover:bg-white/10 transition-all duration-300 backdrop-blur-sm"
                            >
                                Join Community
                            </Link>
                        </div>
                    </div>
                </div>
                
                {/* Floating Elements */}
                <div className="absolute top-20 left-10 animate-bounce">
                    <div className="w-16 h-16 bg-gradient-to-r from-pink-500 to-violet-500 rounded-full opacity-20"></div>
                </div>
                <div className="absolute bottom-20 right-10 animate-pulse">
                    <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full opacity-30"></div>
                </div>
            </section>

           

            {/* Trending Movies Section */}
            <section className="py-20 px-4 bg-black/20">
                <div className="container mx-auto">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
                            Trending Now
                        </h2>
                        <p className="text-xl text-gray-400">
                            What everyone's watching and talking about
                        </p>
                    </div>
                    
                    {loading ? (
                        <div className="grid md:grid-cols-3 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                            {[...Array(6)].map((_, index) => (
                                <div key={index} className="group relative bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl overflow-hidden shadow-xl animate-pulse">
                                    <div className="aspect-[3/4] bg-gradient-to-br from-purple-600/30 to-blue-600/30 flex items-center justify-center">
                                        <span className="text-6xl opacity-30">🎬</span>
                                    </div>
                                    <div className="p-4">
                                        <div className="h-5 bg-white/10 rounded mb-1"></div>
                                        <div className="flex justify-between items-center text-sm">
                                            <div className="h-4 bg-white/10 rounded w-20"></div>
                                            <div className="flex items-center space-x-1">
                                                <span className="text-yellow-400/40">⭐</span>
                                                <div className="h-4 bg-white/10 rounded w-6"></div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0"></div>
                                </div>
                            ))}
                        </div>
                    ) : error ? (
                        <div className="text-center py-12">
                            <div className="text-6xl mb-4">😞</div>
                            <h3 className="text-2xl font-bold text-white mb-2">Unable to Load Trending Movies</h3>
                            <p className="text-gray-400 mb-6">{error}</p>
                            <button 
                                onClick={() => window.location.reload()}
                                className="px-6 py-3 bg-gradient-to-r from-pink-500 to-violet-500 rounded-xl text-white font-semibold hover:from-pink-600 hover:to-violet-600 transition-all duration-300"
                            >
                                Try Again
                            </button>
                        </div>
                    ) : (
                        <div className="grid md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                            {trendingMovies.map((movie) => (
                                <div key={movie.imdbID || movie.Title} className="group relative bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-sm rounded-2xl overflow-hidden border border-white/10 hover:border-white/20 transition-all duration-300 hover:scale-105 hover:shadow-2xl">
                                    {/* Movie Poster */}
                                    <div className="relative aspect-[3/4] overflow-hidden">
                                        {movie.Poster && movie.Poster !== 'N/A' ? (
                                            <img 
                                                src={movie.Poster} 
                                                alt={movie.Title} 
                                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" 
                                            />
                                        ) : (
                                            <div className="w-full h-full bg-gradient-to-br from-purple-600 to-blue-600 flex items-center justify-center">
                                                <span className="text-6xl opacity-50">🎬</span>
                                            </div>
                                        )}
                                        
                                        {/* Overlay */}
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                        
                                        {/* Rating Badge */}
                                        {movie.imdbRating && movie.imdbRating !== 'N/A' && (
                                            <div className="absolute top-3 right-3 bg-black/70 backdrop-blur-sm rounded-xl px-3 py-1 flex items-center space-x-1">
                                                <span className="text-yellow-400 text-sm">⭐</span>
                                                <span className="text-white font-semibold text-sm">{movie.imdbRating}</span>
                                            </div>
                                        )}
                                        
                                        {/* Genre Badge */}
                                        {movie.Genre && (
                                            <div className="absolute top-3 left-3 bg-gradient-to-r from-pink-500/80 to-violet-500/80 backdrop-blur-sm rounded-xl px-3 py-1">
                                                <span className="text-white text-xs font-medium">{movie.Genre.split(',')[0]}</span>
                                            </div>
                                        )}
                                    </div>

                                    {/* Movie Info */}
                                    <div className="p-4">
                                        <Link 
                                            to={`/movies/${movie.imdbID}`}
                                            className="block group-hover:text-pink-400 transition-colors duration-300"
                                        >
                                            <h3 className="text-lg font-bold text-white mb-1 line-clamp-2 leading-tight">
                                                {movie.Title}
                                            </h3>
                                        </Link>
                                        
                                        <div className="flex items-center justify-between text-sm text-gray-400 mb-3">
                                            {movie.Year && <span>{movie.Year}</span>}
                                            {movie.Type && <span className="capitalize">{movie.Type}</span>}
                                        </div>
                                        
                                        {movie.Plot && movie.Plot !== 'N/A' && (
                                            <p className="text-gray-300 text-xs line-clamp-2 leading-relaxed mb-3">
                                                {movie.Plot}
                                            </p>
                                        )}

                                        {/* Action Button */}
                                        <div className="flex items-center justify-between">
                                            <Link
                                                to={`/movies/${movie.imdbID}`}
                                                className="flex items-center space-x-1 px-3 py-1.5 bg-gradient-to-r from-pink-500/20 to-violet-500/20 rounded-lg text-white hover:from-pink-500/30 hover:to-violet-500/30 transition-all duration-300 border border-white/10"
                                            >
                                                <span className="text-xs font-medium">View Details</span>
                                                <span className="text-xs">→</span>
                                            </Link>
                                        </div>
                                    </div>

                                    {/* Hover Effect Overlay */}
                                    <div className="absolute inset-0 bg-gradient-to-t from-pink-500/5 to-violet-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
                                </div>
                            ))}
                        </div>
                    )}
                    
                    <div className="text-center mt-12">
                        <Link
                            to="/movies"
                            className="inline-flex items-center px-8 py-4 bg-white/10 backdrop-blur-sm rounded-2xl font-semibold text-white hover:bg-white/20 transition-all duration-300 border border-white/20"
                        >
                            View All Movies
                            <span className="ml-2">→</span>
                        </Link>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-20 px-4">
                <div className="container mx-auto text-center">
                    <div className="max-w-3xl mx-auto bg-gradient-to-r from-pink-500/10 to-violet-500/10 backdrop-blur-sm rounded-3xl p-12 border border-white/10">
                        <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
                            Ready to Start Your
                            <br />
                            <span className="bg-gradient-to-r from-pink-400 to-violet-400 bg-clip-text text-transparent">
                                Movie Journey?
                            </span>
                        </h2>
                        <p className="text-xl text-gray-300 mb-8">
                            Join thousands of movie enthusiasts and never miss a great film again.
                        </p>
                        <Link
                            to="/register"
                            className="inline-flex items-center px-10 py-5 bg-gradient-to-r from-pink-500 to-violet-500 rounded-2xl font-bold text-lg hover:from-pink-600 hover:to-violet-600 transition-all duration-300 shadow-2xl hover:shadow-pink-500/25 hover:scale-105"
                        >
                            Get Started Free
                            
                        </Link>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default HomePage;
