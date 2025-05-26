/**
 * TMDb API service for fetching movie and TV show data
 * @see https://developer.themoviedb.org/reference/intro/getting-started
 */

const TMDB_BASE_URL = 'https://api.themoviedb.org/3';
const TMDB_IMAGE_BASE_URL = 'https://image.tmdb.org/t/p';

export interface TMDbMovie {
    id: number;
    title: string;
    overview: string;
    poster_path: string | null;
    backdrop_path: string | null;
    release_date: string;
    vote_average: number;
    vote_count: number;
    popularity: number;
    original_language: string;
    genre_ids: number[];
    adult: boolean;
    video: boolean;
    original_title: string;
}

export interface TMDbTVShow {
    id: number;
    name: string;
    overview: string;
    poster_path: string | null;
    backdrop_path: string | null;
    first_air_date: string;
    vote_average: number;
    vote_count: number;
    popularity: number;
    original_language: string;
    genre_ids: number[];
    adult: boolean;
    origin_country: string[];
    original_name: string;
}

export interface TMDbMovieDetails extends TMDbMovie {
    runtime: number | null;
    status: string;
    genres: { id: number; name: string }[];
    production_companies: { id: number; name: string; logo_path: string | null }[];
    production_countries: { iso_3166_1: string; name: string }[];
    spoken_languages: { iso_639_1: string; name: string }[];
    budget: number;
    revenue: number;
    tagline: string | null;
    homepage: string | null;
    imdb_id: string | null;
}

export interface TMDbTVDetails extends TMDbTVShow {
    number_of_episodes: number;
    number_of_seasons: number;
    status: string;
    genres: { id: number; name: string }[];
    created_by: { id: number; name: string; profile_path: string | null }[];
    production_companies: { id: number; name: string; logo_path: string | null }[];
    networks: { id: number; name: string; logo_path: string | null }[];
    episode_run_time: number[];
    last_air_date: string;
    in_production: boolean;
    languages: string[];
    origin_country: string[];
    seasons: Array<{
        id: number;
        name: string;
        overview: string;
        poster_path: string | null;
        season_number: number;
        episode_count: number;
        air_date: string;
    }>;
}

export interface TMDbSearchResponse {
    page: number;
    results: (TMDbMovie | TMDbTVShow)[];
    total_pages: number;
    total_results: number;
}

export interface TMDbMultiSearchResponse {
    page: number;
    results: Array<TMDbMovie | TMDbTVShow | { media_type: 'person'; [key: string]: any }>;
    total_pages: number;
    total_results: number;
}

export class TMDbService {
    private apiKey: string;

    constructor(apiKey: string) {
        this.apiKey = apiKey;
    }

    private async fetchFromTMDb<T>(endpoint: string): Promise<T> {
        const url = `${TMDB_BASE_URL}${endpoint}`;
        
        const response = await fetch(url, {
            headers: {
                'Authorization': `Bearer ${this.apiKey}`,
                'Content-Type': 'application/json',
            },
        });
        
        if (!response.ok) {
            throw new Error(`TMDb API error: ${response.status} ${response.statusText}`);
        }
        
        return response.json();
    }

    /**
     * Search for movies and TV shows
     */
    async searchMulti(query: string, page: number = 1): Promise<TMDbMultiSearchResponse> {
        const encodedQuery = encodeURIComponent(query);
        return this.fetchFromTMDb(`/search/multi?query=${encodedQuery}&page=${page}`);
    }

    /**
     * Search for movies only
     */
    async searchMovies(query: string, page: number = 1): Promise<TMDbSearchResponse> {
        const encodedQuery = encodeURIComponent(query);
        return this.fetchFromTMDb(`/search/movie?query=${encodedQuery}&page=${page}`);
    }

    /**
     * Search for TV shows only
     */
    async searchTVShows(query: string, page: number = 1): Promise<TMDbSearchResponse> {
        const encodedQuery = encodeURIComponent(query);
        return this.fetchFromTMDb(`/search/tv?query=${encodedQuery}&page=${page}`);
    }

    /**
     * Get movie details by ID
     */
    async getMovieDetails(movieId: number): Promise<TMDbMovieDetails> {
        return this.fetchFromTMDb(`/movie/${movieId}`);
    }

    /**
     * Get TV show details by ID
     */
    async getTVDetails(tvId: number): Promise<TMDbTVDetails> {
        return this.fetchFromTMDb(`/tv/${tvId}`);
    }

    /**
     * Get popular movies
     */
    async getPopularMovies(page: number = 1): Promise<TMDbSearchResponse> {
        return this.fetchFromTMDb(`/movie/popular?page=${page}`);
    }

    /**
     * Get popular TV shows
     */
    async getPopularTVShows(page: number = 1): Promise<TMDbSearchResponse> {
        return this.fetchFromTMDb(`/tv/popular?page=${page}`);
    }

    /**
     * Get trending movies and TV shows
     */
    async getTrending(mediaType: 'all' | 'movie' | 'tv' = 'all', timeWindow: 'day' | 'week' = 'week'): Promise<TMDbSearchResponse> {
        return this.fetchFromTMDb(`/trending/${mediaType}/${timeWindow}`);
    }

    /**
     * Get movie recommendations based on a specific movie
     */
    async getMovieRecommendations(movieId: number, page: number = 1): Promise<TMDbSearchResponse> {
        return this.fetchFromTMDb(`/movie/${movieId}/recommendations?page=${page}`);
    }

    /**
     * Get TV show recommendations based on a specific TV show
     */
    async getTVRecommendations(tvId: number, page: number = 1): Promise<TMDbSearchResponse> {
        return this.fetchFromTMDb(`/tv/${tvId}/recommendations?page=${page}`);
    }

    /**
     * Get similar movies to a specific movie
     */
    async getSimilarMovies(movieId: number, page: number = 1): Promise<TMDbSearchResponse> {
        return this.fetchFromTMDb(`/movie/${movieId}/similar?page=${page}`);
    }

    /**
     * Get similar TV shows to a specific TV show
     */
    async getSimilarTV(tvId: number, page: number = 1): Promise<TMDbSearchResponse> {
        return this.fetchFromTMDb(`/tv/${tvId}/similar?page=${page}`);
    }

    /**
     * Discover movies with advanced filtering options
     */
    async discoverMovies(options: {
        page?: number;
        sort_by?: 'popularity.desc' | 'popularity.asc' | 'release_date.desc' | 'release_date.asc' | 'revenue.desc' | 'revenue.asc' | 'primary_release_date.desc' | 'primary_release_date.asc' | 'original_title.asc' | 'original_title.desc' | 'vote_average.desc' | 'vote_average.asc' | 'vote_count.desc' | 'vote_count.asc';
        with_genres?: string; // Comma-separated genre IDs
        without_genres?: string; // Comma-separated genre IDs to exclude
        with_companies?: string; // Comma-separated company IDs
        with_keywords?: string; // Comma-separated keyword IDs
        vote_average_gte?: number; // Minimum rating
        vote_average_lte?: number; // Maximum rating
        vote_count_gte?: number; // Minimum number of votes
        release_date_gte?: string; // YYYY-MM-DD format
        release_date_lte?: string; // YYYY-MM-DD format
        with_runtime_gte?: number; // Minimum runtime in minutes
        with_runtime_lte?: number; // Maximum runtime in minutes
        with_original_language?: string; // ISO 639-1 language code
    } = {}): Promise<TMDbSearchResponse> {
        const params = new URLSearchParams();
        
        // Set defaults
        params.set('page', (options.page || 1).toString());
        params.set('sort_by', options.sort_by || 'popularity.desc');
        
        // Add optional filters
        if (options.with_genres) params.set('with_genres', options.with_genres);
        if (options.without_genres) params.set('without_genres', options.without_genres);
        if (options.with_companies) params.set('with_companies', options.with_companies);
        if (options.with_keywords) params.set('with_keywords', options.with_keywords);
        if (options.vote_average_gte !== undefined) params.set('vote_average.gte', options.vote_average_gte.toString());
        if (options.vote_average_lte !== undefined) params.set('vote_average.lte', options.vote_average_lte.toString());
        if (options.vote_count_gte !== undefined) params.set('vote_count.gte', options.vote_count_gte.toString());
        if (options.release_date_gte) params.set('release_date.gte', options.release_date_gte);
        if (options.release_date_lte) params.set('release_date.lte', options.release_date_lte);
        if (options.with_runtime_gte !== undefined) params.set('with_runtime.gte', options.with_runtime_gte.toString());
        if (options.with_runtime_lte !== undefined) params.set('with_runtime.lte', options.with_runtime_lte.toString());
        if (options.with_original_language) params.set('with_original_language', options.with_original_language);
        
        return this.fetchFromTMDb(`/discover/movie?${params.toString()}`);
    }

    /**
     * Discover TV shows with advanced filtering options
     */
    async discoverTV(options: {
        page?: number;
        sort_by?: 'popularity.desc' | 'popularity.asc' | 'first_air_date.desc' | 'first_air_date.asc' | 'vote_average.desc' | 'vote_average.asc' | 'vote_count.desc' | 'vote_count.asc';
        with_genres?: string; // Comma-separated genre IDs
        without_genres?: string; // Comma-separated genre IDs to exclude
        with_networks?: string; // Comma-separated network IDs
        with_companies?: string; // Comma-separated company IDs
        with_keywords?: string; // Comma-separated keyword IDs
        vote_average_gte?: number; // Minimum rating
        vote_average_lte?: number; // Maximum rating
        vote_count_gte?: number; // Minimum number of votes
        first_air_date_gte?: string; // YYYY-MM-DD format
        first_air_date_lte?: string; // YYYY-MM-DD format
        with_runtime_gte?: number; // Minimum runtime in minutes
        with_runtime_lte?: number; // Maximum runtime in minutes
        with_original_language?: string; // ISO 639-1 language code
    } = {}): Promise<TMDbSearchResponse> {
        const params = new URLSearchParams();
        
        // Set defaults
        params.set('page', (options.page || 1).toString());
        params.set('sort_by', options.sort_by || 'popularity.desc');
        
        // Add optional filters
        if (options.with_genres) params.set('with_genres', options.with_genres);
        if (options.without_genres) params.set('without_genres', options.without_genres);
        if (options.with_networks) params.set('with_networks', options.with_networks);
        if (options.with_companies) params.set('with_companies', options.with_companies);
        if (options.with_keywords) params.set('with_keywords', options.with_keywords);
        if (options.vote_average_gte !== undefined) params.set('vote_average.gte', options.vote_average_gte.toString());
        if (options.vote_average_lte !== undefined) params.set('vote_average.lte', options.vote_average_lte.toString());
        if (options.vote_count_gte !== undefined) params.set('vote_count.gte', options.vote_count_gte.toString());
        if (options.first_air_date_gte) params.set('first_air_date.gte', options.first_air_date_gte);
        if (options.first_air_date_lte) params.set('first_air_date.lte', options.first_air_date_lte);
        if (options.with_runtime_gte !== undefined) params.set('with_runtime.gte', options.with_runtime_gte.toString());
        if (options.with_runtime_lte !== undefined) params.set('with_runtime.lte', options.with_runtime_lte.toString());
        if (options.with_original_language) params.set('with_original_language', options.with_original_language);
        
        return this.fetchFromTMDb(`/discover/tv?${params.toString()}`);
    }

    /**
     * Get movie genres list
     */
    async getMovieGenres(): Promise<{ genres: { id: number; name: string }[] }> {
        return this.fetchFromTMDb('/genre/movie/list');
    }

    /**
     * Get TV genres list
     */
    async getTVGenres(): Promise<{ genres: { id: number; name: string }[] }> {
        return this.fetchFromTMDb('/genre/tv/list');
    }

    /**
     * Build image URL with specified size
     */
    static getImageUrl(path: string | null, size: 'w92' | 'w154' | 'w185' | 'w342' | 'w500' | 'w780' | 'original' = 'w500'): string | null {
        if (!path) return null;
        return `${TMDB_IMAGE_BASE_URL}/${size}${path}`;
    }

    /**
     * Build backdrop image URL with specified size
     */
    static getBackdropUrl(path: string | null, size: 'w300' | 'w780' | 'w1280' | 'original' = 'w1280'): string | null {
        if (!path) return null;
        return `${TMDB_IMAGE_BASE_URL}/${size}${path}`;
    }
}

export default TMDbService;
