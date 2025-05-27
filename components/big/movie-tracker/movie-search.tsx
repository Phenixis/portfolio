'use client';

import { useState } from 'react';
import { Search, Plus, Film, Tv } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useMovieSearch, useMovieActions } from '@/hooks/use-movies';
import { useDebounce } from 'use-debounce';
import TMDbService from '@/lib/services/tmdb';
import { toast } from 'sonner';

interface MovieSearchProps {
    onMovieAdded?: () => void;
}

export function MovieSearch({ onMovieAdded }: MovieSearchProps) {
    const [searchQuery, setSearchQuery] = useState('');
    const [debouncedQuery] = useDebounce(searchQuery, 500);
    const { results, isLoading } = useMovieSearch(debouncedQuery);
    const { addMovie } = useMovieActions();

    const handleAddMovie = async (
        tmdbId: number, 
        mediaType: 'movie' | 'tv',
        title: string,
        watchStatus: 'will_watch' | 'watched' = 'will_watch'
    ) => {
        try {
            await addMovie(tmdbId, mediaType, watchStatus);
            toast.success(`${title} added to your ${watchStatus === 'will_watch' ? 'watchlist' : 'watched list'}!`);
            onMovieAdded?.();
        } catch (error) {
            if (error instanceof Error && error.message.includes('already in your list')) {
                toast.error('This movie is already in your list');
            } else {
                toast.error('Failed to add movie');
            }
        }
    };

    const getMediaTypeIcon = (mediaType?: string) => {
        return mediaType === 'tv' ? <Tv className="w-4 h-4" /> : <Film className="w-4 h-4" />;
    };

    const getTitle = (item: { title?: string; name?: string }) => {
        return item.title || item.name || 'Unknown Title';
    };

    const getReleaseDate = (item: { release_date?: string; first_air_date?: string }) => {
        const date = item.release_date || item.first_air_date;
        return date ? new Date(date).getFullYear() : null;
    };

    const filteredResults = results.results.filter(
        (item: { media_type?: string; title?: string; name?: string }) =>
            item.media_type !== 'person' && (item.title || item.name)
    );

    return (
        <div className="space-y-4">
            <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                    placeholder="Search for movies and TV shows..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                />
            </div>

            {isLoading && searchQuery && (
                <div className="text-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
                    <p className="text-muted-foreground mt-2">Searching...</p>
                </div>
            )}

            {filteredResults.length > 0 && (
                <div className="space-y-3 max-h-96 overflow-y-auto">
                    {filteredResults.map((item) => {
                        const title = getTitle(item);
                        const releaseYear = getReleaseDate(item);
                        const mediaType = item.media_type || 'movie';
                        const posterUrl = TMDbService.getImageUrl(item.poster_path, 'w154');

                        return (
                            <Card key={`${item.id}-${mediaType}`} className="hover:shadow-md transition-shadow">
                                <CardContent fullPadding>
                                    <div className="flex gap-4">
                                        {/* Poster */}
                                        <div className="flex-shrink-0">
                                            {posterUrl ? (
                                                <img
                                                    src={posterUrl}
                                                    alt={title}
                                                    className="w-16 h-24 object-cover rounded-md"
                                                />
                                            ) : (
                                                <div className="w-16 h-24 bg-muted rounded-md flex items-center justify-center">
                                                    {getMediaTypeIcon(mediaType)}
                                                </div>
                                            )}
                                        </div>

                                        {/* Content */}
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-start justify-between gap-2">
                                                <div className="flex-1">
                                                    <h3 className="font-semibold text-sm line-clamp-2">
                                                        {title}
                                                        {releaseYear && (
                                                            <span className="text-muted-foreground ml-1">
                                                                ({releaseYear})
                                                            </span>
                                                        )}
                                                    </h3>
                                                    <div className="flex items-center gap-2 mt-1">
                                                        <Badge variant="secondary" className="text-xs">
                                                            {getMediaTypeIcon(mediaType)}
                                                            <span className="ml-1 capitalize">
                                                                {mediaType === 'tv' ? 'TV Show' : 'Movie'}
                                                            </span>
                                                        </Badge>
                                                        {item.vote_average > 0 && (
                                                            <Badge variant="outline" className="text-xs">
                                                                ⭐ {item.vote_average.toFixed(1)}
                                                            </Badge>
                                                        )}
                                                    </div>
                                                    {item.overview && (
                                                        <p className="text-xs text-muted-foreground mt-2 line-clamp-2">
                                                            {item.overview}
                                                        </p>
                                                    )}
                                                </div>

                                                {/* Action Buttons */}
                                                <div className="flex flex-col gap-1 flex-shrink-0">
                                                    <Button
                                                        size="sm"
                                                        onClick={() => handleAddMovie(item.id, mediaType as 'movie' | 'tv', title, 'will_watch')}
                                                        className="text-xs px-2 py-1 h-auto"
                                                        >
                                                        <Plus className="w-3 h-3 mr-1" />
                                                        Watchlist
                                                    </Button>
                                                    <Button
                                                        size="sm"
                                                        variant="outline"
                                                        onClick={() => handleAddMovie(item.id, mediaType as 'movie' | 'tv', title, 'watched')}
                                                        className="text-xs px-2 py-1 h-auto"
                                                    >
                                                        <Plus className="w-3 h-3 mr-1" />
                                                        Watched
                                                    </Button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        );
                    })}
                </div>
            )}

            {searchQuery && !isLoading && filteredResults.length === 0 && (
                <div className="text-center py-8">
                    <p className="text-muted-foreground">No results found for &quot;{searchQuery}&quot;</p>
                </div>
            )}
        </div>
    );
}
