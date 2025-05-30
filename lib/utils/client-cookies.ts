'use client';

import { 
    WatchlistFilterCookie, 
    MoviesFilterCookie, 
    DiscoverFilterCookie,
    MovieTrackerFiltersCookie,
    defaultWatchlistFilterCookie,
    defaultMoviesFilterCookie,
    defaultDiscoverFilterCookie,
    defaultMovieTrackerFiltersCookie
} from "@/lib/types/watchlist";

/**
 * Client-side cookie utilities for managing movie tracker filters
 */

export function getClientMovieTrackerFiltersCookie(): MovieTrackerFiltersCookie {
    if (typeof document === 'undefined') {
        return defaultMovieTrackerFiltersCookie;
    }
    
    const cookies = document.cookie.split(';');
    const movieTrackerCookie = cookies.find(cookie => 
        cookie.trim().startsWith('movie_tracker_filters=')
    );
    
    if (!movieTrackerCookie) {
        return defaultMovieTrackerFiltersCookie;
    }
    
    try {
        const cookieValue = movieTrackerCookie.split('=')[1];
        const decodedValue = decodeURIComponent(cookieValue);
        const parsed = JSON.parse(decodedValue) as MovieTrackerFiltersCookie;
        
        // Ensure all sections exist with defaults
        return {
            watchlist: { ...defaultWatchlistFilterCookie, ...parsed.watchlist },
            movies: { ...defaultMoviesFilterCookie, ...parsed.movies },
            discover: { ...defaultDiscoverFilterCookie, ...parsed.discover }
        };
    } catch (error) {
        console.error("Failed to parse movie tracker filters cookie:", error);
        return defaultMovieTrackerFiltersCookie;
    }
}

export function setClientMovieTrackerFiltersCookie(cookie: MovieTrackerFiltersCookie): void {
    if (typeof document === 'undefined') {
        return;
    }
    
    const maxAge = 30 * 24 * 60 * 60; // 30 days in seconds
    const cookieString = `movie_tracker_filters=${encodeURIComponent(JSON.stringify(cookie))}; path=/; max-age=${maxAge}; SameSite=Lax`;
    document.cookie = cookieString;
}

export function updateClientMovieTrackerFiltersCookie(
    section: 'watchlist' | 'movies' | 'discover',
    updates: Partial<WatchlistFilterCookie | MoviesFilterCookie | DiscoverFilterCookie>
): MovieTrackerFiltersCookie {
    const currentCookie = getClientMovieTrackerFiltersCookie();
    const updatedCookie = {
        ...currentCookie,
        [section]: { ...currentCookie[section], ...updates }
    };
    setClientMovieTrackerFiltersCookie(updatedCookie);
    return updatedCookie;
}

// Backward compatibility functions for existing watchlist code
export function getClientWatchlistFilterCookie(): WatchlistFilterCookie {
    const allFilters = getClientMovieTrackerFiltersCookie();
    return allFilters.watchlist || defaultWatchlistFilterCookie;
}

export function updateClientWatchlistFilterCookie(updates: Partial<WatchlistFilterCookie>): WatchlistFilterCookie {
    const updatedFilters = updateClientMovieTrackerFiltersCookie('watchlist', updates);
    return updatedFilters.watchlist || defaultWatchlistFilterCookie;
}

// New utility functions for movies and discover tabs
export function getClientMoviesFilterCookie(): MoviesFilterCookie {
    const allFilters = getClientMovieTrackerFiltersCookie();
    return allFilters.movies || defaultMoviesFilterCookie;
}

export function updateClientMoviesFilterCookie(updates: Partial<MoviesFilterCookie>): MoviesFilterCookie {
    const updatedFilters = updateClientMovieTrackerFiltersCookie('movies', updates);
    return updatedFilters.movies || defaultMoviesFilterCookie;
}

export function getClientDiscoverFilterCookie(): DiscoverFilterCookie {
    const allFilters = getClientMovieTrackerFiltersCookie();
    return allFilters.discover || defaultDiscoverFilterCookie;
}

export function updateClientDiscoverFilterCookie(updates: Partial<DiscoverFilterCookie>): DiscoverFilterCookie {
    const updatedFilters = updateClientMovieTrackerFiltersCookie('discover', updates);
    return updatedFilters.discover || defaultDiscoverFilterCookie;
}
