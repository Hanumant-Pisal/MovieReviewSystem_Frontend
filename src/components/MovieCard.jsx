import { Link } from 'react-router-dom';

const MovieCard = ({ movie, showActions = false, onRemove }) => {
    return (
        <div className="group relative bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-sm rounded-2xl overflow-hidden border border-white/10 hover:border-white/20 transition-all duration-300 hover:scale-105 hover:shadow-2xl">
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
                        <span className="text-white text-xs font-medium">{movie.Genre}</span>
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

                {/* Action Buttons */}
                <div className="flex items-center justify-between">
                    <Link
                        to={`/movies/${movie.imdbID}`}
                        className="flex items-center space-x-1 px-3 py-1.5 bg-gradient-to-r from-pink-500/20 to-violet-500/20 rounded-lg text-white hover:from-pink-500/30 hover:to-violet-500/30 transition-all duration-300 border border-white/10"
                    >
                        <span className="text-xs font-medium">View Details</span>
                        <span className="text-xs">→</span>
                    </Link>
                    
                    {showActions && onRemove && (
                        <button
                            onClick={() => onRemove(movie.imdbID)}
                            className="p-2 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-xl transition-all duration-300"
                            title="Remove from watchlist"
                        >
                            <span className="text-lg">🗑️</span>
                        </button>
                    )}
                </div>
            </div>

            {/* Hover Effect Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-pink-500/5 to-violet-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
        </div>
    );
};

export default MovieCard;
