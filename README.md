# 🎬 Movie Review System - Frontend

> A modern, responsive web application for movie enthusiasts to discover, review, and manage their favorite films.

![Movie Review System](https://img.shields.io/badge/React-18.x-blue?style=for-the-badge&logo=react)
![Redux Toolkit](https://img.shields.io/badge/Redux_Toolkit-1.9.x-purple?style=for-the-badge&logo=redux)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.x-38B2AC?style=for-the-badge&logo=tailwind-css)
![Vite](https://img.shields.io/badge/Vite-4.x-646CFF?style=for-the-badge&logo=vite)

## Features




### NOTE //

 use OMDB API becuase there is some problems with TMDB website - Hanumant Pisal




### Core Functionality
- **Movie Discovery**: Browse and search thousands of movies using OMDB API  
- **User Reviews & Ratings**: Write detailed reviews and rate movies with star system
- **Personal Watchlist**: Save movies to watch later with easy management
- **Advanced Search**: Find movies by title, genre, year, and more
- **Trending Movies**: Discover what's popular and trending

### User Experience
- **User Authentication**: Secure login/register system with JWT tokens
- **Profile Management**: Personalized user profiles with statistics
- **Admin Dashboard**: Administrative controls for user and Movies management
- **Responsive Design**: Seamless experience across desktop, tablet, and mobile


### Design & UI
- **Modern Interface**: Clean, intuitive design with smooth animations
- **Glass Morphism**: Beautiful backdrop blur effects and transparency
- **Interactive Cards**: Hover effects and smooth transitions
- **Gradient Accents**: Pink to violet gradient theme throughout
- **Loading States**: Elegant loading spinners and skeleton screens

## Tech Stack

### Frontend Framework
- **React** - Modern React with hooks and functional components
- **Vite** - Fast build tool and development server
- **React Router DOM** - Client-side routing and navigation

### State Management
- **Redux Toolkit** - Simplified Redux for state management


### Styling & UI
- **Tailwind CSS** - Utility-first CSS framework
- **React Icons** - Comprehensive icon library
- **Custom CSS** - Additional styling for animations and effects

### API Integration
- **OMDB API** - Movie database for film information
- **Axios** - HTTP client for API requests
- **Custom Backend API** - User management and reviews

## Getting Started

### Prerequisites

Make sure you have the following installed:
- **Node.js** (v16.0.0 or higher)
- **npm** 
- **Git**

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Hanumant-Pisal/Movie-Review-System.git
   cd Movie-Review-System/frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
  
   ```

3. **Environment Setup**
   
   The API configuration is already set up in `src/utils/apiConfig.js`:
   ```javascript
   // Backend API Configuration
   export const API_BASE_URL = 'http://localhost:5000/api';
   
   // OMDB API Configuration
   export const OMDB_API_KEY = 'add your omdb api key';
   export const OMDB_BASE_URL = 'http://www.omdbapi.com';
   ```

4. **Start the development server**
   ```bash
   npm run dev
   # or
   yarn dev
   ```

5. **Open your browser**
   
   Navigate to `http://localhost:5173` to see the application.

## Project Structure

```
frontend/
├── public/
│   └── vite.svg
├── src/
│   ├── components/          
│   │   ├── Footer.jsx
│   │   ├── Header.jsx
│   │   ├── LoadingSpinner.jsx
│   │   └── MovieCard.jsx
│   ├── pages/              
│   │   ├── AboutPage.jsx
│   │   ├── HomePage.jsx
│   │   ├── LoginPage.jsx
│   │   ├── MovieDetailsPage.jsx
│   │   ├── MovieListPage.jsx
│   │   ├── ProfilePage.jsx
│   │   ├── RegisterPage.jsx
│   │   └── WatchlistPage.jsx
│   ├── redux/              
│   │   ├── slices/
│   │   └── store.js
│   ├── routes/             
│   │   └── AppRouter.jsx
│   ├── services/           
│   │   └── movieService.js
│   ├── utils/              
│   │   └── apiConfig.js
│   ├── App.jsx
│   ├── index.css
│   └── main.jsx
├── index.html
├── package.json
├── tailwind.config.js
├── vite.config.js
└── README.md
```

## Available Scripts

- **`npm run dev`** - Start development server
- **`npm run build`** - Build for production
- **`npm run preview`** - Preview production build
- **`npm run lint`** - Run ESLint

## Configuration

### API Configuration

The application uses two main APIs:

1. **OMDB API** - For movie data
   - Base URL: `http://www.omdbapi.com`
   - API Key: Configured in `apiConfig.js`

2. **Backend API** - For user management and reviews
   - Base URL: `http://localhost:5000/api`
   - Requires backend server to be running

### Tailwind CSS

Custom configuration in `tailwind.config.js` includes:
- Custom color palette
- Extended spacing and sizing
- Custom animations and transitions

## Key Pages

- **`/`** - Home page with trending movies and hero section
- **`/movies`** - Movie search and browse page
- **`/movies/:id`** - Individual movie details and reviews
- **`/about`** - About the developer and platform
- **`/profile`** - User profile and admin dashboard
- **`/watchlist`** - Personal movie watchlist
- **`/login`** - User authentication
- **`/register`** - User registration

## Design System

### Color Palette
- **Primary**: Pink to Violet gradient (`from-pink-500 to-violet-500`)
- **Background**: Dark slate with purple accents
- **Text**: White primary, gray secondary
- **Accents**: Yellow for ratings, various colors for badges

### Typography
- **Headings**: Bold, gradient text effects
- **Body**: Clean, readable fonts with proper spacing
- **Interactive**: Hover effects and color transitions

## Deployment

### Build for Production

```bash
npm run build
```

This creates a `dist` folder with optimized production files.


## Developer

**Hanumant Pisal**
-  B.Tech in Computer Science Engineering
-  Full Stack Developer (MERN Stack)
-  [LinkedIn](https://www.linkedin.com/in/hanumant-pisal-5111a2236/)
-  [GitHub](https://github.com/Hanumant-Pisal)
-  [Instagram](https://www.instagram.com/software_engg96/)
-  [Facebook](https://www.facebook.com/hanumant.pisal.79)


