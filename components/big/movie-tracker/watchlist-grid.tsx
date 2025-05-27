'use client';

import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { WatchlistCard } from './watchlist-card';
import { useMovies } from '@/hooks/use-movies';
import { useDebounce } from 'use-debounce';
import { Search, SortAsc, SortDesc } from 'lucide-react';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

type SortBy = 'updated' | 'title' | 'vote_average' | 'date_added';
type SortOrder = 'asc' | 'desc';

export function WatchlistGrid() {
    const [searchQuery, setSearchQuery] = useState('');
    const [sortBy, setSortBy] = useState<SortBy>('date_added');
    const [sortOrder, setSortOrder] = useState<SortOrder>('desc');
    const [debouncedQuery] = useDebounce(searchQuery, 300);

    const { movies: willWatchMovies, isLoading: isLoadingWillWatch } = useMovies('will_watch');
    const { movies: searchMovies, isLoading: isLoadingSearch } = useMovies(undefined, debouncedQuery);

    // Determine which movies to show
    let movies = willWatchMovies;
    let isLoading = isLoadingWillWatch;

    if (debouncedQuery) {
        // Filter search results to only show will_watch movies
        movies = searchMovies.filter(movie => movie.watch_status === 'will_watch');
        isLoading = isLoadingSearch;
    }

    // Sort movies
    const sortedMovies = [...movies].sort((a, b) => {
        let comparison = 0;

        switch (sortBy) {
            case 'title':
                comparison = a.title.localeCompare(b.title);
                break;
            case 'vote_average':
                const ratingA = a.vote_average || 0;
                const ratingB = b.vote_average || 0;
                comparison = ratingA - ratingB;
                break;
            case 'date_added':
                comparison = new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
                break;
            case 'updated':
            default:
                comparison = new Date(a.updated_at).getTime() - new Date(b.updated_at).getTime();
                break;
        }

        return sortOrder === 'asc' ? comparison : -comparison;
    });

    const sortOptions = [
        { value: 'date_added', label: 'Date Added' },
        { value: 'updated', label: 'Recently Updated' },
        { value: 'title', label: 'Title' },
        { value: 'tmdb_rating', label: 'Rating' },
    ];

    return (
        <div className="space-y-6">
            {/* Filters and Search */}
            <div className="flex flex-col sm:flex-row gap-4">
                {/* Search */}
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                    <Input
                        placeholder="Search your watchlist..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-10"
                    />
                </div>

                {/* Sort */}
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="outline" className="gap-2">
                            {sortOrder === 'asc' ? (
                                <SortAsc className="w-4 h-4" />
                            ) : (
                                <SortDesc className="w-4 h-4" />
                            )}
                            {sortOptions.find(s => s.value === sortBy)?.label}
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Sort by</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        {sortOptions.map((option) => (
                            <DropdownMenuItem
                                key={option.value}
                                onClick={() => setSortBy(option.value as SortBy)}
                            >
                                {option.label}
                            </DropdownMenuItem>
                        ))}
                        <DropdownMenuSeparator />
                        <DropdownMenuLabel>Order</DropdownMenuLabel>
                        <DropdownMenuItem onClick={() => setSortOrder('desc')}>
                            <SortDesc className="w-4 h-4 mr-2" />
                            Descending
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setSortOrder('asc')}>
                            <SortAsc className="w-4 h-4 mr-2" />
                            Ascending
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>

            {/* Results count */}
            {!isLoading && (
                <div className="flex items-center justify-between">
                    <p className="text-sm text-muted-foreground">
                        {sortedMovies.length} {sortedMovies.length === 1 ? 'movie' : 'movies'} in your watchlist
                    </p>
                </div>
            )}

            {/* Movie Grid */}
            {isLoading ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                    {Array.from({ length: 12 }).map((_, i) => (
                        <div key={i} className="aspect-[2/3] bg-muted rounded-lg animate-pulse"></div>
                    ))}
                </div>
            ) : sortedMovies.length > 0 ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                    {sortedMovies.map((movie) => (
                        <WatchlistCard key={movie.id} movie={movie} />
                    ))}
                </div>
            ) : (
                <div className="text-center py-12">
                    <div className="text-muted-foreground">
                        {debouncedQuery ? (
                            <>No movies found for "{debouncedQuery}" in your watchlist</>
                        ) : (
                            <>Your watchlist is empty</>
                        )}
                    </div>
                    {!debouncedQuery && (
                        <p className="text-sm text-muted-foreground mt-2">
                            Discover new movies to add to your watchlist!
                        </p>
                    )}
                </div>
            )}
        </div>
    );
}
