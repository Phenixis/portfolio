'use client';

import useSWR, { mutate } from 'swr';
import { useUser } from '@/hooks/use-user';
import { fetcher } from '@/lib/fetcher';
import type { Movie } from '@/lib/db/schema';

interface MovieStats {
    total: number;
    watched: number;
    willWatch: number;
    averageRating: number | null;
}

interface TMDbSearchResult {
    id: number;
    title?: string;
    name?: string;
    overview: string;
    poster_path: string | null;
    backdrop_path: string | null;
    release_date?: string;
    first_air_date?: string;
    vote_average: number;
    vote_count: number;
    popularity: number;
    media_type?: 'movie' | 'tv';
}

interface SearchResponse {
    results: TMDbSearchResult[];
    page: number;
    total_pages: number;
    total_results: number;
}

interface RecommendationResult extends TMDbSearchResult {
    recommendation_source: 'similar_to_rated' | 'genre_discovery' | 'trending';
}

interface RecommendationsResponse {
    recommendations: RecommendationResult[];
    page: number;
    total_pages: number;
    total_results: number;
    method: 'personalized' | 'popular_fallback';
    based_on?: {
        high_rated_count: number;
        top_genres: number[];
        strategies_used: string[];
    };
}

export function useMovies(status?: 'will_watch' | 'watched', search?: string) {
    const { user } = useUser();
    
    const url = status ? `/api/movie/list?status=${status}` : 
                search ? `/api/movie/list?search=${encodeURIComponent(search)}` :
                '/api/movie/list';
    
    const { data, error, isLoading } = useSWR(
        user ? url : null,
        (url) => fetcher(url, user!.api_key)
    );

    return {
        movies: data?.movies as Movie[] || [],
        isLoading,
        error
    };
}

export function useMovieStats() {
    const { user } = useUser();
    
    const { data, error, isLoading } = useSWR(
        user ? '/api/movie/stats' : null,
        (url) => fetcher(url, user!.api_key)
    );

    return {
        stats: data as MovieStats || { total: 0, watched: 0, willWatch: 0, averageRating: null },
        isLoading,
        error
    };
}

export function useMovieSearch(query: string, type: 'multi' | 'movie' | 'tv' = 'multi') {
    const { user } = useUser();
    
    const url = query.trim() ? 
        `/api/movie/search?q=${encodeURIComponent(query)}&type=${type}` : 
        null;
    
    const { data, error, isLoading } = useSWR(
        user && url ? url : null,
        (url) => fetcher(url, user!.api_key)
    );

    return {
        results: data as SearchResponse || { results: [], page: 1, total_pages: 0, total_results: 0 },
        isLoading,
        error
    };
}

export function useMovieRecommendations(mediaType: 'movie' | 'tv' | 'all' = 'all', page: number = 1) {
    const { user } = useUser();
    
    const url = `/api/movie/recommendations?media_type=${mediaType}&page=${page}`;
    
    const { data, error, isLoading } = useSWR(
        user ? url : null,
        (url) => fetcher(url, user!.api_key),
        {
            revalidateOnFocus: false, // Don't revalidate on window focus
            dedupingInterval: 5 * 60 * 1000, // Cache for 5 minutes
        }
    );

    return {
        recommendations: data as RecommendationsResponse || {
            recommendations: [],
            page: 1,
            total_pages: 0,
            total_results: 0,
            method: 'popular_fallback'
        },
        isLoading,
        error
    };
}

export function useMovieActions() {
    const { user } = useUser();

    const addMovie = async (tmdbId: number, mediaType: 'movie' | 'tv', watchStatus: 'will_watch' | 'watched' = 'will_watch') => {
        if (!user) throw new Error('User not authenticated');

        const response = await fetch('/api/movie', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${user.api_key}`
            },
            body: JSON.stringify({
                tmdb_id: tmdbId,
                media_type: mediaType,
                watch_status: watchStatus
            })
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error || 'Failed to add movie');
        }

        // Invalidate movie lists
        mutate((key) => typeof key === 'string' && key.startsWith('/api/movie/'));
        
        return response.json();
    };

    const updateMovie = async (
        movieId: number, 
        updates: {
            user_rating?: number | null;
            user_comment?: string | null;
            watch_status?: 'will_watch' | 'watched';
            watched_date?: string;
        }
    ) => {
        if (!user) throw new Error('User not authenticated');

        const response = await fetch('/api/movie', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${user.api_key}`
            },
            body: JSON.stringify({
                movie_id: movieId,
                ...updates
            })
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error || 'Failed to update movie');
        }

        // Invalidate movie lists
        mutate((key) => typeof key === 'string' && key.startsWith('/api/movie/'));
        
        return response.json();
    };

    const deleteMovie = async (movieId: number) => {
        if (!user) throw new Error('User not authenticated');

        const response = await fetch(`/api/movie?id=${movieId}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${user.api_key}`
            }
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error || 'Failed to delete movie');
        }

        // Invalidate movie lists
        mutate((key) => typeof key === 'string' && key.startsWith('/api/movie/'));
        
        return response.json();
    };

    return {
        addMovie,
        updateMovie,
        deleteMovie
    };
}
