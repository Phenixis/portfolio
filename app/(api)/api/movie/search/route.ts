import { NextRequest, NextResponse } from 'next/server';
import { verifyRequest } from '@/lib/auth/api';
import TMDbService from '@/lib/services/tmdb';

/**
 * GET /api/movie/search
 * Search movies and TV shows using TMDb API
 */
export async function GET(request: NextRequest) {
    try {
        // Check authentication
        const verification = await verifyRequest(request);
        if ('error' in verification) {
            return verification.error;
        }

        const { searchParams } = new URL(request.url);
        const query = searchParams.get('q');
        const type = searchParams.get('type') || 'multi'; // 'multi', 'movie', 'tv'
        const page = parseInt(searchParams.get('page') || '1');

        if (!query) {
            return NextResponse.json({ error: 'Query parameter is required' }, { status: 400 });
        }

        // Get TMDb API key from environment
        const tmdbApiKey = process.env.TMDB_ACCESS_TOKEN;
        if (!tmdbApiKey) {
            return NextResponse.json({ error: 'TMDb API key not configured' }, { status: 500 });
        }

        const tmdbService = new TMDbService(tmdbApiKey);
        let results;

        switch (type) {
            case 'movie':
                results = await tmdbService.searchMovies(query, page);
                break;
            case 'tv':
                results = await tmdbService.searchTVShows(query, page);
                break;
            default:
                results = await tmdbService.searchMulti(query, page);
                break;
        }

        return NextResponse.json(results);
    } catch (error) {
        console.error('Movie search error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
