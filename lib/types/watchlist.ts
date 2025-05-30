/**
 * Type definitions for movie tracker filters
 * Separate from flags.ts to avoid client-side import issues
 */

export interface WatchlistFilterCookie {
    search?: string
    sortBy?: 'updated' | 'title' | 'vote_average' | 'date_added'
    sortOrder?: 'asc' | 'desc'
    mediaFilter?: 'all' | 'movie' | 'tv'
    currentPage?: number
}

export interface MoviesFilterCookie {
    search?: string
    sortBy?: 'updated' | 'title' | 'vote_average' | 'date_added'
    sortOrder?: 'asc' | 'desc'
    ratingFilter?: 'all' | '1' | '2' | '3' | '4' | '5' | 'no_rating'
    currentPage?: number
}

export interface DiscoverFilterCookie {
    filter?: 'all' | 'movie' | 'tv'
}

export interface MovieTrackerFiltersCookie {
    watchlist?: WatchlistFilterCookie
    movies?: MoviesFilterCookie
    discover?: DiscoverFilterCookie
}

export const defaultWatchlistFilterCookie: WatchlistFilterCookie = {
    search: '',
    sortBy: 'date_added',
    sortOrder: 'desc',
    mediaFilter: 'all',
    currentPage: 1
}

export const defaultMoviesFilterCookie: MoviesFilterCookie = {
    search: '',
    sortBy: 'updated',
    sortOrder: 'desc',
    ratingFilter: 'all',
    currentPage: 1
}

export const defaultDiscoverFilterCookie: DiscoverFilterCookie = {
    filter: 'all'
}

export const defaultMovieTrackerFiltersCookie: MovieTrackerFiltersCookie = {
    watchlist: defaultWatchlistFilterCookie,
    movies: defaultMoviesFilterCookie,
    discover: defaultDiscoverFilterCookie
}
