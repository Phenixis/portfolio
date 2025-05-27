'use client';

import { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    Sparkles,
    TrendingUp,
    Target,
    Film,
    Tv,
    Plus,
    Loader2,
    RefreshCw,
    Eye
} from 'lucide-react';
import { useMovieRecommendations, useMovieActions } from '@/hooks/use-movies';
import TMDbService from '@/lib/services/tmdb';
import { toast } from 'sonner';
import { format } from 'date-fns';

interface DiscoverMoviesProps {
    className?: string;
}

interface MovieCardItemProps {
    item: any;
    isAdding: boolean;
    onAddToWatchlist: (tmdbId: number, mediaType: 'movie' | 'tv') => void;
    onMarkAsWatched: (tmdbId: number, mediaType: 'movie' | 'tv') => void;
    getSourceIcon: (source: string) => React.ReactNode;
    getSourceLabel: (source: string) => string;
}

function MovieCardItem({ 
    item, 
    isAdding, 
    onAddToWatchlist, 
    onMarkAsWatched, 
    getSourceIcon, 
    getSourceLabel 
}: MovieCardItemProps) {
    const [isOverviewExpanded, setIsOverviewExpanded] = useState(false);
    const [shouldShowSeeMore, setShouldShowSeeMore] = useState(false);
    const overviewRef = useRef<HTMLParagraphElement>(null);

    const title = 'title' in item ? item.title : item.name;
    const releaseDate = 'release_date' in item ? item.release_date : item.first_air_date;
    const year = releaseDate ? new Date(releaseDate).getFullYear() : null;
    const posterUrl = TMDbService.getImageUrl(item.poster_path, 'w342');

    // Check if overview text is truncated
    useEffect(() => {
        const checkTextOverflow = () => {
            if (overviewRef.current && item.overview && !isOverviewExpanded) {
                setTimeout(() => {
                    if (overviewRef.current) {
                        const isOverflowing = overviewRef.current.scrollHeight > overviewRef.current.clientHeight;
                        setShouldShowSeeMore(isOverflowing);
                    }
                }, 10);
            } else {
                setShouldShowSeeMore(false);
            }
        };

        checkTextOverflow();
        
        window.addEventListener('resize', checkTextOverflow);
        return () => window.removeEventListener('resize', checkTextOverflow);
    }, [item.overview, isOverviewExpanded]);

    return (
        <Card className="group overflow-hidden hover:shadow-md transition-all duration-200">
            <CardContent className="p-0">
                <div className="relative">
                    {posterUrl ? (
                        <img
                            src={posterUrl}
                            alt={title}
                            className="w-full aspect-[2/3] object-cover"
                        />
                    ) : (
                        <div className="w-full aspect-[2/3] bg-muted flex items-center justify-center">
                            {item.media_type === 'tv' ? (
                                <Tv className="w-8 h-8 text-muted-foreground" />
                            ) : (
                                <Film className="w-8 h-8 text-muted-foreground" />
                            )}
                        </div>
                    )}

                    {/* Overlay with add buttons */}
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2">
                        <Button
                            onClick={() => onAddToWatchlist(item.id, item.media_type || 'movie')}
                            disabled={isAdding}
                            size="sm"
                            className="gap-2"
                        >
                            {isAdding ? (
                                <Loader2 className="w-3 h-3 animate-spin" />
                            ) : (
                                <Plus className="w-3 h-3" />
                            )}
                            Add to Watchlist
                        </Button>
                        <Button
                            onClick={() => onMarkAsWatched(item.id, item.media_type || 'movie')}
                            disabled={isAdding}
                            size="sm"
                            variant="secondary"
                            className="gap-2"
                        >
                            {isAdding ? (
                                <Loader2 className="w-3 h-3 animate-spin" />
                            ) : (
                                <Eye className="w-3 h-3" />
                            )}
                            Mark as Watched
                        </Button>
                    </div>

                    {/* Source badge */}
                    <div className="absolute top-2 left-2">
                        <Badge variant="secondary" className="text-xs gap-1 bg-black/70 text-white border-0">
                            {getSourceIcon('recommendation_source' in item ? item.recommendation_source : 'trending')}
                            <span className="lg:hidden lg:group-hover:inline-block">
                                {getSourceLabel('recommendation_source' in item ? item.recommendation_source : 'trending')}
                            </span>
                        </Badge>
                    </div>

                    {/* Rating badge */}
                    {item.vote_average > 0 && (
                        <div className="absolute top-2 right-2">
                            <Badge variant="secondary" className="text-xs bg-black/70 text-white border-0">
                                ★ {item.vote_average.toFixed(1)}
                            </Badge>
                        </div>
                    )}
                </div>

                <div className="p-4">
                    <div className="flex items-start gap-2 mb-2">
                        <Badge variant="outline" className="text-xs h-5 flex-shrink-0">
                            {item.media_type === 'tv' ? 'TV' : 'Movie'}
                        </Badge>
                        {year && (
                            <span className="text-xs text-muted-foreground">{year}</span>
                        )}
                    </div>

                    <h3 className="font-medium text-sm line-clamp-2 mb-2 leading-tight">
                        {title}
                    </h3>

                    {item.overview && (
                        <div className="space-y-1">
                            <p 
                                ref={overviewRef}
                                className={`text-xs text-muted-foreground leading-relaxed transition-all duration-200 ${
                                    isOverviewExpanded ? '' : 'line-clamp-3'
                                }`}
                            >
                                {item.overview}
                            </p>
                            {(shouldShowSeeMore || isOverviewExpanded) && (
                                <button
                                    onClick={() => setIsOverviewExpanded(!isOverviewExpanded)}
                                    className="text-xs text-primary hover:text-primary/80 transition-colors font-medium"
                                >
                                    {isOverviewExpanded ? 'See less' : 'See more'}
                                </button>
                            )}
                        </div>
                    )}
                </div>
            </CardContent>
        </Card>
    );
}

export function DiscoverMovies({ className }: DiscoverMoviesProps) {
    const [mediaFilter, setMediaFilter] = useState<'all' | 'movie' | 'tv'>('all');
    const { recommendations, isLoading, error } = useMovieRecommendations(mediaFilter);
    const { addMovie } = useMovieActions();
    const [addingIds, setAddingIds] = useState<Set<number>>(new Set());

    const handleAddToWatchlist = async (tmdbId: number, mediaType: 'movie' | 'tv') => {
        try {
            setAddingIds(prev => new Set(prev).add(tmdbId));
            await addMovie(tmdbId, mediaType, 'will_watch');
            toast.success('Added to your watchlist!');
        } catch (error: any) {
            if (error.message.includes('already in your list')) {
                toast.info('This is already in your list');
            } else {
                toast.error('Failed to add to watchlist');
            }
        } finally {
            setAddingIds(prev => {
                const newSet = new Set(prev);
                newSet.delete(tmdbId);
                return newSet;
            });
        }
    };

    const handleMarkAsWatched = async (tmdbId: number, mediaType: 'movie' | 'tv') => {
        try {
            setAddingIds(prev => new Set(prev).add(tmdbId));
            await addMovie(tmdbId, mediaType, 'watched');
            toast.success('Added to watched movies!');
        } catch (error: any) {
            if (error.message.includes('already in your list')) {
                toast.info('This is already in your list');
            } else {
                toast.error('Failed to mark as watched');
            }
        } finally {
            setAddingIds(prev => {
                const newSet = new Set(prev);
                newSet.delete(tmdbId);
                return newSet;
            });
        }
    };



    const getSourceIcon = (source: string) => {
        switch (source) {
            case 'similar_to_rated':
                return <Target className="w-3 h-3" />;
            case 'genre_discovery':
                return <Sparkles className="w-3 h-3" />;
            case 'trending':
                return <TrendingUp className="w-3 h-3" />;
            default:
                return <Sparkles className="w-3 h-3" />;
        }
    };

    const getSourceLabel = (source: string) => {
        switch (source) {
            case 'similar_to_rated':
                return 'Similar to rated';
            case 'genre_discovery':
                return 'Genre match';
            case 'trending':
                return 'Trending';
            default:
                return 'Recommended';
        }
    };

    if (error) {
        return (
            <Card className={className}>
                <CardContent className="p-6 text-center">
                    <p className="text-muted-foreground">Failed to load recommendations</p>
                    <Button
                        variant="outline"
                        size="sm"
                        className="mt-2"
                        onClick={() => window.location.reload()}
                    >
                        <RefreshCw className="w-4 h-4 mr-2" />
                        Retry
                    </Button>
                </CardContent>
            </Card>
        );
    }

    return (
        <div className={className}>
            <Card>
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <div>
                            <CardTitle className="flex items-center gap-2">
                                <Sparkles className="w-5 h-5 text-yellow-500" />
                                Discover
                            </CardTitle>
                            <p className="text-sm text-muted-foreground mt-1">
                                {recommendations.method === 'personalized'
                                    ? `Based on ${recommendations.based_on?.high_rated_count || 0} highly-rated titles`
                                    : null
                                }
                            </p>
                        </div>

                        <div className="flex gap-1">
                            <Button
                                variant={mediaFilter === 'all' ? 'default' : 'outline'}
                                size="sm"
                                onClick={() => setMediaFilter('all')}
                                className="h-8 px-3"
                            >
                                All
                            </Button>
                            <Button
                                variant={mediaFilter === 'movie' ? 'default' : 'outline'}
                                size="sm"
                                onClick={() => setMediaFilter('movie')}
                                className="h-8 px-3"
                            >
                                <Film className="w-3 h-3 mr-1" />
                                Movies
                            </Button>
                            <Button
                                variant={mediaFilter === 'tv' ? 'default' : 'outline'}
                                size="sm"
                                onClick={() => setMediaFilter('tv')}
                                className="h-8 px-3"
                            >
                                <Tv className="w-3 h-3 mr-1" />
                                TV
                            </Button>
                        </div>
                    </div>
                </CardHeader>

                <CardContent className="p-6 pt-0">
                    {isLoading ? (
                        <div className="flex items-center justify-center py-12">
                            <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
                            <span className="ml-2 text-muted-foreground">Finding recommendations...</span>
                        </div>
                    ) : recommendations.recommendations.length === 0 ? (
                        <div className="text-center py-12">
                            <Sparkles className="w-12 h-12 text-muted-foreground/50 mx-auto mb-4" />
                            <p className="text-muted-foreground">No recommendations available</p>
                            <p className="text-sm text-muted-foreground/70 mt-1">
                                Rate some movies to get personalized suggestions!
                            </p>
                        </div>
                    ) : (
                        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                            {recommendations.recommendations.map((item) => {
                                const isAdding = addingIds.has(item.id);

                                return (
                                    <MovieCardItem
                                        key={`${item.id}-${item.media_type}`}
                                        item={item}
                                        isAdding={isAdding}
                                        onAddToWatchlist={handleAddToWatchlist}
                                        onMarkAsWatched={handleMarkAsWatched}
                                        getSourceIcon={getSourceIcon}
                                        getSourceLabel={getSourceLabel}
                                    />
                                );
                            })}
                        </div>
                    )}

                    {/* Strategy info for personalized recommendations */}
                    {recommendations.method === 'personalized' && recommendations.based_on && (
                        <div className="mt-6 p-4 bg-muted/50 rounded-lg">
                            <p className="text-xs text-muted-foreground">
                                <span className="font-medium">Recommendation strategy:</span> Based on your highly-rated content,
                                using {recommendations.based_on.strategies_used.join(', ')} to find similar titles.
                            </p>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
