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
    buffer: RecommendationResult[];
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
    
    const { data, error, isLoading, mutate: mutateSWR } = useSWR(
        user ? url : null,
        (url) => fetcher(url, user!.api_key),
        {
            revalidateOnFocus: false, // Don't revalidate on window focus
            dedupingInterval: 60 * 1000, // Cache for 60 seconds
        }
    );

    const refresh = async () => {
        if (user && url) {
            // Trigger a fresh fetch without cache manipulation
            await mutateSWR();
        }
    };

    /**
     * Replace a specific recommendation item with a new one
     * This avoids full list refresh when adding movies.
     * Uses buffer movies when available, falls back to API call if needed.
     */
    const replaceRecommendation = async (tmdbIdToRemove: number) => {
        if (!user || !data) return;

        try {
            const currentData = data as RecommendationsResponse;
            const buffer = currentData.buffer || [];
            
            // First try to use a movie from the buffer
            if (buffer.length > 0) {
                const replacementMovie = buffer[0];
                const remainingBuffer = buffer.slice(1);
                
                // Create new recommendations array with the removed item replaced
                const updatedRecommendations = currentData.recommendations.map(rec => 
                    rec.id === tmdbIdToRemove ? replacementMovie : rec
                );

                // Update the cache with the new data and reduced buffer
                await mutateSWR({
                    ...currentData,
                    recommendations: updatedRecommendations,
                    buffer: remainingBuffer
                }, { revalidate: false });
                
                return;
            }
            
            // Fallback: If no buffer available, fetch a single recommendation
            const existingIds = currentData.recommendations.map(rec => rec.id);
            
            // Get a replacement recommendation excluding current list + the removed item
            const excludeIds = [...existingIds];
            const singleRecUrl = `/api/movie/recommendations/single?media_type=${mediaType}&exclude_ids=${excludeIds.join(',')}`;
            
            const response = await fetcher(singleRecUrl, user.api_key);
            
            if (response?.recommendation) {
                // Create new recommendations array with the removed item replaced
                const updatedRecommendations = currentData.recommendations.map(rec => 
                    rec.id === tmdbIdToRemove ? response.recommendation : rec
                );

                // Update the cache with the new data
                await mutateSWR({
                    ...currentData,
                    recommendations: updatedRecommendations
                }, { revalidate: false });
            }
        } catch (error) {
            console.warn('Failed to replace recommendation, falling back to full refresh:', error);
            // Fall back to full refresh if replacement fails
            await refresh();
        }
    };

    return {
        recommendations: data as RecommendationsResponse || {
            recommendations: [],
            buffer: [],
            page: 1,
            total_pages: 0,
            total_results: 0,
            method: 'popular_fallback'
        },
        isLoading,
        error,
        refresh,
        replaceRecommendation
    };
}

export function useMovieActions() {
    const { user } = useUser();

    const addMovie = async (
        tmdbId: number, 
        mediaType: 'movie' | 'tv', 
        watchStatus: 'will_watch' | 'watched' = 'will_watch',
        options?: { optimizeRecommendations?: boolean }
    ) => {
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

        // Invalidate movie lists (but not recommendations if optimizing)
        if (options?.optimizeRecommendations) {
            // Only invalidate non-recommendation endpoints
            mutate((key) => 
                typeof key === 'string' && 
                key.startsWith('/api/movie/') && 
                !key.includes('/api/movie/recommendations')
            );
        } else {
            // Invalidate all movie endpoints (current behavior)
            mutate((key) => typeof key === 'string' && key.startsWith('/api/movie/'));
        }
        
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

    const markAsNotInterested = async (
        tmdbId: number, 
        mediaType: 'movie' | 'tv', 
        title: string,
        options?: { optimizeRecommendations?: boolean }
    ) => {
        if (!user) throw new Error('User not authenticated');

        const response = await fetch('/api/movie/not-interested', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${user.api_key}`
            },
            body: JSON.stringify({
                tmdb_id: tmdbId,
                media_type: mediaType,
                title: title
            })
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error || 'Failed to mark as not interested');
        }

        // Invalidate recommendations to refresh them (unless optimizing)
        if (!options?.optimizeRecommendations) {
            mutate((key) => typeof key === 'string' && key.includes('/api/movie/recommendations'));
        }
        
        return response.json();
    };

    const removeFromNotInterested = async (tmdbId: number, mediaType: 'movie' | 'tv') => {
        if (!user) throw new Error('User not authenticated');

        const response = await fetch(`/api/movie/not-interested?tmdb_id=${tmdbId}&media_type=${mediaType}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${user.api_key}`
            }
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error || 'Failed to remove from not interested');
        }

        // Invalidate recommendations to refresh them
        mutate((key) => typeof key === 'string' && key.includes('/api/movie/recommendations'));
        
        return response.json();
    };

    return {
        addMovie,
        updateMovie,
        deleteMovie,
        markAsNotInterested,
        removeFromNotInterested
    };
}
