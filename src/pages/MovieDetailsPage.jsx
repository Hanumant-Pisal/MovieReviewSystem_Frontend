import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { fetchMovieById } from '../services/movieService';
import { API_BASE_URL } from '../utils/apiConfig';
import LoadingSpinner from '../components/LoadingSpinner';

const MovieDetailsPage = () => {
    const { id } = useParams();
    const { user, isAuthenticated } = useSelector(state => state.auth);
    const [movie, setMovie] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [watchlistLoading, setWatchlistLoading] = useState(false);
    const [watchlistMessage, setWatchlistMessage] = useState('');
    
    // Review states
    const [reviews, setReviews] = useState([]);
    const [reviewsLoading, setReviewsLoading] = useState(false);
    const [showReviewForm, setShowReviewForm] = useState(false);
    const [reviewFormData, setReviewFormData] = useState({ rating: 5, reviewText: '' });
    const [reviewSubmitting, setReviewSubmitting] = useState(false);
    const [reviewMessage, setReviewMessage] = useState('');
    const [averageRating, setAverageRating] = useState(0);
    const [totalReviews, setTotalReviews] = useState(0);

    useEffect(() => {
        const getMovieDetails = async () => {
            setLoading(true);
            setError(null);
            try {
                const data = await fetchMovieById(id);
                if (data.Response === 'True') {
                    setMovie(data);
                    // Fetch reviews after movie is loaded
                    fetchMovieReviews(data.imdbID);
                } else {
                    setError(data.Error || 'Movie not found');
                }
            } catch (err) {
                setError('Failed to fetch movie details');
            } finally {
                setLoading(false);
            }
        };

        if (id) {
            getMovieDetails();
        }
    }, [id]);

    const fetchMovieReviews = async (movieId) => {
        setReviewsLoading(true);
        try {
            const response = await fetch(`${API_BASE_URL}/reviews/movie/${movieId}`);
            if (response.ok) {
                const data = await response.json();
                setReviews(data.reviews || []);
                setAverageRating(data.averageRating || 0);
                setTotalReviews(data.totalReviews || 0);
            }
        } catch (error) {
            console.error('Failed to fetch reviews:', error);
        } finally {
            setReviewsLoading(false);
        }
    };

    const handleReviewSubmit = async (e) => {
        e.preventDefault();
        
        if (!isAuthenticated || !user) {
            setReviewMessage('Please log in to write a review');
            return;
        }

        setReviewSubmitting(true);
        setReviewMessage('');

        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${API_BASE_URL}/reviews`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    movieId: movie.imdbID,
                    movieTitle: movie.Title,
                    movieYear: movie.Year,
                    moviePoster: movie.Poster,
                    rating: reviewFormData.rating,
                    reviewText: reviewFormData.reviewText
                })
            });

            const data = await response.json();

            if (response.ok) {
                setReviewMessage('Review submitted successfully!');
                setShowReviewForm(false);
                setReviewFormData({ rating: 5, reviewText: '' });
                // Refresh reviews
                fetchMovieReviews(movie.imdbID);
            } else {
                setReviewMessage(data.message || 'Failed to submit review');
            }
        } catch (error) {
            setReviewMessage('Network error. Please try again.');
        } finally {
            setReviewSubmitting(false);
            setTimeout(() => setReviewMessage(''), 5000);
        }
    };

    const addToWatchlist = async () => {
        if (!isAuthenticated || !user) {
            setWatchlistMessage('Please log in to add movies to your watchlist');
            return;
        }

        setWatchlistLoading(true);
        setWatchlistMessage('');

        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${API_BASE_URL}/watchlist/${user.id}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    imdbId: movie.imdbID,
                    movieTitle: movie.Title,
                    moviePoster: movie.Poster,
                    movieYear: movie.Year
                })
            });

            const data = await response.json();

            if (response.ok) {
                setWatchlistMessage('Movie added to watchlist successfully!');
            } else {
                setWatchlistMessage(data.message || 'Failed to add movie to watchlist');
            }
        } catch (error) {
            setWatchlistMessage('Network error. Please try again.');
        } finally {
            setWatchlistLoading(false);
            // Clear message after 3 seconds
            setTimeout(() => setWatchlistMessage(''), 3000);
        }
    };

    if (loading) return <LoadingSpinner />;
    
    if (error) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
                <div className="text-center">
                    <div className="text-6xl mb-4">😞</div>
                    <h2 className="text-2xl font-bold text-white mb-2">Movie Not Found</h2>
                    <p className="text-gray-400 mb-6">{error}</p>
                    <Link 
                        to="/movies" 
                        className="px-6 py-3 bg-gradient-to-r from-pink-500 to-violet-500 rounded-xl text-white font-semibold hover:from-pink-600 hover:to-violet-600 transition-all duration-300"
                    >
                        Back to Movies
                    </Link>
                </div>
            </div>
        );
    }

    if (!movie) return null;

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
            <div className="container mx-auto px-4 py-6">
                {/* Back Button */}
                <Link 
                    to="/movies" 
                    className="inline-flex items-center space-x-2 text-gray-400 hover:text-white transition-colors duration-300 mb-8"
                >
                    <span>←</span>
                    <span>Back to Movies</span>
                </Link>

                <div className="grid lg:grid-cols-4 gap-6">
                    {/* Movie Poster */}
                    <div className="lg:col-span-1">
                        <div className="sticky top-8">
                            {movie.Poster && movie.Poster !== 'N/A' ? (
                                <img 
                                    src={movie.Poster} 
                                    alt={movie.Title} 
                                    className="w-full rounded-2xl shadow-2xl"
                                />
                            ) : (
                                <div className="w-full aspect-[3/4] bg-gradient-to-br from-purple-600 to-blue-600 rounded-2xl flex items-center justify-center">
                                    <span className="text-8xl opacity-50">🎬</span>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Movie Details */}
                    <div className="lg:col-span-3">
                        <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
                            {/* Plot */}
                            <div className="mb-4">
                                <h1 className="text-3xl font-bold text-white mb-2">{movie.Title}</h1>
                                <div className="flex items-center space-x-4 text-gray-400">
                                    {movie.Year && <span>{movie.Year}</span>}
                                    {movie.Rated && <span className="px-2 py-1 bg-white/10 rounded text-xs">{movie.Rated}</span>}
                                </div>
                            </div>

                            {/* Rating and Genre */}
                            <div className="flex items-center space-x-6 mb-4">
                                {movie.imdbRating && movie.imdbRating !== 'N/A' && (
                                    <div className="flex items-center space-x-2">
                                        <span className="text-yellow-400 text-xl">⭐</span>
                                        <span className="text-white font-semibold">{movie.imdbRating}/10</span>
                                        <span className="text-gray-400 text-sm">({movie.imdbVotes} votes)</span>
                                    </div>
                                )}
                                {movie.Genre && (
                                    <div className="flex flex-wrap gap-2">
                                        {movie.Genre.split(', ').map((genre, index) => (
                                            <span 
                                                key={index}
                                                className="px-2 py-1 bg-gradient-to-r from-pink-500/20 to-violet-500/20 rounded-lg text-white text-xs border border-white/10"
                                            >
                                                {genre}
                                            </span>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {/* Plot */}
                            {movie.Plot && movie.Plot !== 'N/A' && (
                                <div className="mb-6">
                                    <h3 className="text-lg font-semibold text-white mb-2">Plot</h3>
                                    <p className="text-gray-300 leading-relaxed">{movie.Plot}</p>
                                </div>
                            )}

                            {/* Cast and Crew */}
                            <div className="grid md:grid-cols-2 gap-4 mb-4">
                                {movie.Director && movie.Director !== 'N/A' && (
                                    <div>
                                        <h4 className="text-base font-semibold text-white mb-1">Director</h4>
                                        <p className="text-gray-300">{movie.Director}</p>
                                    </div>
                                )}
                                {movie.Actors && movie.Actors !== 'N/A' && (
                                    <div>
                                        <h4 className="text-base font-semibold text-white mb-1">Cast</h4>
                                        <p className="text-gray-300">{movie.Actors}</p>
                                    </div>
                                )}
                                {movie.Writer && movie.Writer !== 'N/A' && (
                                    <div>
                                        <h4 className="text-base font-semibold text-white mb-1">Writer</h4>
                                        <p className="text-gray-300">{movie.Writer}</p>
                                    </div>
                                )}
                                {movie.Language && movie.Language !== 'N/A' && (
                                    <div>
                                        <h4 className="text-base font-semibold text-white mb-1">Language</h4>
                                        <p className="text-gray-300">{movie.Language}</p>
                                    </div>
                                )}
                            </div>

                            {/* Additional Info */}
                            {movie.BoxOffice && movie.BoxOffice !== 'N/A' && (
                                <div className="mb-4">
                                    <h4 className="text-base font-semibold text-white mb-1">Box Office</h4>
                                    <p className="text-gray-300">{movie.BoxOffice}</p>
                                </div>
                            )}

                            {/* Watchlist Message */}
                            {watchlistMessage && (
                                <div className={`mb-4 p-3 rounded-lg ${
                                    watchlistMessage.includes('successfully') 
                                        ? 'bg-green-500/10 border border-green-500/20 text-green-400'
                                        : 'bg-red-500/10 border border-red-500/20 text-red-400'
                                }`}>
                                    <p className="text-sm">{watchlistMessage}</p>
                                </div>
                            )}

                            {/* Action Buttons */}
                            <div className="flex items-center space-x-4">
                                {isAuthenticated && (
                                    <>
                                        <button 
                                            onClick={addToWatchlist}
                                            disabled={watchlistLoading}
                                            className="px-4 py-2 bg-gradient-to-r from-pink-500 to-violet-500 rounded-lg text-white font-semibold hover:from-pink-600 hover:to-violet-600 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            {watchlistLoading ? (
                                                <div className="flex items-center space-x-2">
                                                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                                    <span>Adding...</span>
                                                </div>
                                            ) : (
                                                'Add to Watchlist'
                                            )}
                                        </button>
                                        <button 
                                            onClick={() => setShowReviewForm(!showReviewForm)}
                                            className="px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white font-semibold hover:bg-white/20 transition-all duration-300"
                                        >
                                            {showReviewForm ? 'Cancel Review' : 'Write Review'}
                                        </button>
                                    </>
                                )}
                                {movie.imdbID && (
                                    <a 
                                        href={`https://www.imdb.com/title/${movie.imdbID}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="px-4 py-2 bg-yellow-600/20 border border-yellow-500/30 rounded-lg text-yellow-400 font-semibold hover:bg-yellow-600/30 transition-all duration-300"
                                    >
                                        View on IMDb
                                    </a>
                                )}
                            </div>
                        </div>

                        {/* Review Form */}
                        {showReviewForm && (
                            <div className="mt-6 bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
                                <h3 className="text-xl font-bold text-white mb-4">Write a Review</h3>
                                
                                {reviewMessage && (
                                    <div className={`mb-4 p-3 rounded-lg ${
                                        reviewMessage.includes('successfully') 
                                            ? 'bg-green-500/10 border border-green-500/20 text-green-400'
                                            : 'bg-red-500/10 border border-red-500/20 text-red-400'
                                    }`}>
                                        <p className="text-sm">{reviewMessage}</p>
                                    </div>
                                )}

                                <form onSubmit={handleReviewSubmit} className="space-y-4">
                                    <div>
                                        <label className="block text-white font-semibold mb-2">Rating</label>
                                        <div className="flex items-center space-x-2">
                                            {[1, 2, 3, 4, 5].map((star) => (
                                                <button
                                                    key={star}
                                                    type="button"
                                                    onClick={() => setReviewFormData({...reviewFormData, rating: star})}
                                                    className={`text-2xl transition-colors ${
                                                        star <= reviewFormData.rating ? 'text-yellow-400' : 'text-gray-600'
                                                    }`}
                                                >
                                                    ⭐
                                                </button>
                                            ))}
                                            <span className="text-white ml-2">{reviewFormData.rating}/5</span>
                                        </div>
                                    </div>
                                    
                                    <div>
                                        <label className="block text-white font-semibold mb-2">Review (Optional)</label>
                                        <textarea
                                            value={reviewFormData.reviewText}
                                            onChange={(e) => setReviewFormData({...reviewFormData, reviewText: e.target.value})}
                                            placeholder="Share your thoughts about this movie..."
                                            rows={4}
                                            className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-pink-500/50 focus:border-pink-500/50 transition-all duration-300"
                                        />
                                    </div>
                                    
                                    <div className="flex items-center space-x-4">
                                        <button
                                            type="submit"
                                            disabled={reviewSubmitting}
                                            className="px-6 py-3 bg-gradient-to-r from-pink-500 to-violet-500 rounded-xl text-white font-semibold hover:from-pink-600 hover:to-violet-600 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            {reviewSubmitting ? (
                                                <div className="flex items-center space-x-2">
                                                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                                    <span>Submitting...</span>
                                                </div>
                                            ) : (
                                                'Submit Review'
                                            )}
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => {
                                                setShowReviewForm(false);
                                                setReviewFormData({ rating: 5, reviewText: '' });
                                            }}
                                            className="px-6 py-3 bg-white/10 border border-white/20 rounded-xl text-white font-semibold hover:bg-white/20 transition-all duration-300"
                                        >
                                            Cancel
                                        </button>
                                    </div>
                                </form>
                            </div>
                        )}

                        {/* Reviews Section */}
                        <div className="mt-6 bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
                            <div className="flex items-center justify-between mb-6">
                                <h3 className="text-xl font-bold text-white">Reviews</h3>
                                {totalReviews > 0 && (
                                    <div className="flex items-center space-x-4">
                                        <div className="flex items-center space-x-2">
                                            <span className="text-yellow-400 text-lg">⭐</span>
                                            <span className="text-white font-semibold">{averageRating.toFixed(1)}/5</span>
                                        </div>
                                        <span className="text-gray-400">({totalReviews} review{totalReviews !== 1 ? 's' : ''})</span>
                                    </div>
                                )}
                            </div>

                            {reviewsLoading ? (
                                <div className="flex items-center justify-center py-8">
                                    <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                    <span className="text-white ml-2">Loading reviews...</span>
                                </div>
                            ) : reviews.length > 0 ? (
                                <div className="space-y-4">
                                    {reviews.map((review) => (
                                        <div key={review._id} className="bg-white/5 rounded-xl p-4 border border-white/10">
                                            <div className="flex items-center justify-between mb-2">
                                                <div className="flex items-center space-x-3">
                                                    <span className="text-white font-semibold">{review.userId?.username || 'Anonymous'}</span>
                                                    <div className="flex items-center space-x-1">
                                                        {[...Array(review.rating)].map((_, i) => (
                                                            <span key={i} className="text-sm text-yellow-400">
                                                                ⭐
                                                            </span>
                                                        ))}
                                                    </div>
                                                </div>
                                                <span className="text-gray-400 text-sm">
                                                    {new Date(review.timestamp).toLocaleDateString()}
                                                </span>
                                            </div>
                                            {review.reviewText && (
                                                <p className="text-gray-300 leading-relaxed">{review.reviewText}</p>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-8">
                                    <div className="text-4xl mb-2">📝</div>
                                    <p className="text-gray-400">No reviews yet. Be the first to review this movie!</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MovieDetailsPage;
