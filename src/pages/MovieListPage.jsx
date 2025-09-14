import { useEffect, useState, useCallback } from 'react';
import { searchMovies } from '../services/movieService';
import MovieCard from '../components/MovieCard';
import LoadingSpinner from '../components/LoadingSpinner';
import { MdMenu } from "react-icons/md";

const MovieListPage = () => {
    const [movies, setMovies] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('batman');
    const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('batman');
    const [selectedGenre, setSelectedGenre] = useState('');
    const [sortBy, setSortBy] = useState('title');
    const [currentPage, setCurrentPage] = useState(1);
    const [totalResults, setTotalResults] = useState(0);

    // Debounce search term
    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedSearchTerm(searchTerm);
        }, 500); // Wait 500ms after user stops typing

        return () => clearTimeout(timer);
    }, [searchTerm]);

    const fetchMoviesData = useCallback(async (search = 'batman', page = 1) => {
        if (!search.trim()) return;
        
        setLoading(true);
        setError(null);
        try {
            const data = await searchMovies(search, page);
            if (data.Response === 'True') {
                setMovies(data.Search || []);
                setTotalResults(parseInt(data.totalResults) || 0);
            } else {
                setMovies([]);
                setError(data.Error || 'No movies found');
            }
        } catch (err) {
            setError('Failed to fetch movies. Please try again.');
            setMovies([]);
        } finally {
            setLoading(false);
        }
    }, []);

    // Only fetch when debounced search term changes
    useEffect(() => {
        fetchMoviesData(debouncedSearchTerm, currentPage);
    }, [debouncedSearchTerm, currentPage, fetchMoviesData]);

    const handleSearch = (e) => {
        const newSearchTerm = e.target.value;
        setSearchTerm(newSearchTerm);
        setCurrentPage(1);
    };

    const displayMovies = movies;
    const genres = [...new Set(displayMovies.map(movie => movie.Genre))];

    // Filter and sort movies
    const filteredMovies = displayMovies
        .filter(movie => 
            (selectedGenre === '' || movie.Genre === selectedGenre)
        )
        .sort((a, b) => {
            switch (sortBy) {
                case 'rating':
                    return (parseFloat(b.imdbRating) || 0) - (parseFloat(a.imdbRating) || 0);
                case 'year':
                    return (parseInt(b.Year) || 0) - (parseInt(a.Year) || 0);
                case 'title':
                default:
                    return a.Title.localeCompare(b.Title);
            }
        });

    if (loading) return <LoadingSpinner />;

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
            <div className="container mx-auto px-4 py-8">
                {/* Header */}
                <div className="text-center mb-12">
                    <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">
                        Discover <span className="bg-gradient-to-r from-pink-400 to-violet-400 bg-clip-text text-transparent">Movies</span>
                    </h1>
                    <p className="text-xl text-gray-300 max-w-2xl mx-auto">
                        Explore our vast collection of movies from every genre and era
                    </p>
                </div>

                {/* Search and Filters */}
                <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 mb-8 border border-white/10">
                    <div className="grid md:grid-cols-3 gap-4">
                        {/* Search */}
                        <div className="relative">
                            <input
                                type="text"
                                placeholder="Search movies..."
                                value={searchTerm}
                                onChange={handleSearch}
                                className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-pink-500/50 focus:border-pink-500/50 transition-all duration-300"
                            />
                            <span className="absolute right-2 top-2 text-gray-400 text-sm">🔍</span>
                        </div>

                        {/* Genre Filter */}
                        <select
                            value={selectedGenre}
                            onChange={(e) => setSelectedGenre(e.target.value)}
                            className="px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-pink-500/50 focus:border-pink-500/50 transition-all duration-300"
                        >
                            <option value="">All Genres</option>
                            {genres.map(genre => (
                                <option key={genre} value={genre} className="bg-gray-800">
                                    {genre}
                                </option>
                            ))}
                        </select>

                        {/* Sort */}
                        <select
                            value={sortBy}
                            onChange={(e) => setSortBy(e.target.value)}
                            className="px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-pink-500/50 focus:border-pink-500/50 transition-all duration-300"
                        >
                            <option value="title" className="bg-gray-800">Sort by Title</option>
                            <option value="rating" className="bg-gray-800">Sort by Rating</option>
                            <option value="year" className="bg-gray-800">Sort by Year</option>
                        </select>
                    </div>
                </div>

                {/* Results Count and Error Display */}
                <div className="flex justify-between items-center mb-8">
                    {error ? (
                        <p className="text-red-400">
                            {error}
                        </p>
                    ) : (
                        <p className="text-gray-300">
                            Showing <span className="text-white font-semibold">{filteredMovies.length}</span> of <span className="text-white font-semibold">{totalResults}</span> movies
                        </p>
                    )}
                    
                </div>

                {/* Movies Grid */}
                {filteredMovies.length > 0 ? (
                    <div className="grid md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                        {filteredMovies.map(movie => (
                            <MovieCard key={movie.imdbID} movie={movie} />
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-20">
                        <div className="text-6xl mb-4">🎬</div>
                        <h3 className="text-2xl font-bold text-white mb-2">No movies found</h3>
                        <p className="text-gray-400">Try adjusting your search or filters</p>
                    </div>
                )}

                {/* Pagination */}
                {totalResults > 10 && (
                    <div className="flex justify-center items-center space-x-4 mt-12">
                        <button 
                            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                            disabled={currentPage === 1}
                            className="px-6 py-3 bg-gradient-to-r from-pink-500/20 to-violet-500/20 border border-white/20 rounded-xl text-white font-semibold hover:from-pink-500/30 hover:to-violet-500/30 transition-all duration-300 backdrop-blur-sm disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            Previous
                        </button>
                        
                        <span className="text-white">
                            Page {currentPage} of {Math.ceil(totalResults / 10)}
                        </span>
                        
                        <button 
                            onClick={() => setCurrentPage(prev => prev + 1)}
                            disabled={currentPage >= Math.ceil(totalResults / 10)}
                            className="px-6 py-3 bg-gradient-to-r from-pink-500/20 to-violet-500/20 border border-white/20 rounded-xl text-white font-semibold hover:from-pink-500/30 hover:to-violet-500/30 transition-all duration-300 backdrop-blur-sm disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            Next
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default MovieListPage;
