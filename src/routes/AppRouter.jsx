import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from '../pages/HomePage';
import MovieListPage from '../pages/MovieListPage';
import MovieDetailsPage from '../pages/MovieDetailsPage';
import AboutPage from '../pages/AboutPage';
import ProfilePage from '../pages/ProfilePage';
import LoginPage from '../pages/LoginPage';
import RegisterPage from '../pages/RegisterPage';
import WatchlistPage from '../pages/WatchlistPage';
import Header from '../components/Header';
import Footer from '../components/Footer';

const AppRouter = () => (
    <Router>
        <div className="min-h-screen flex flex-col">
            <Header />
            <main className="flex-1">
                <Routes>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/movies" element={<MovieListPage />} />
                    <Route path="/movies/:id" element={<MovieDetailsPage />} />
                    <Route path="/about" element={<AboutPage />} />
                    <Route path="/profile" element={<ProfilePage />} />
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/register" element={<RegisterPage />} />
                    <Route path="/watchlist" element={<WatchlistPage />} />
                </Routes>
            </main>
            <Footer />
        </div>
    </Router>
);

export default AppRouter;
