'use client';

import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MovieCard } from './movie-card';
import { useMovies } from '@/hooks/use-movies';
import { useDebounce } from 'use-debounce';
import { Search, Filter, SortAsc, SortDesc } from 'lucide-react';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

type WatchStatus = 'all' | 'will_watch' | 'watched';
type SortBy = 'updated' | 'title' | 'rating' | 'date_added';
type SortOrder = 'asc' | 'desc';

export function MovieList() {
    const [searchQuery, setSearchQuery] = useState('');
    const [watchStatus, setWatchStatus] = useState<WatchStatus>('all');
    const [sortBy, setSortBy] = useState<SortBy>('updated');
    const [sortOrder, setSortOrder] = useState<SortOrder>('desc');
    const [debouncedQuery] = useDebounce(searchQuery, 300);

    const { movies: allMovies, isLoading: isLoadingAll } = useMovies();
    const { movies: watchedMovies, isLoading: isLoadingWatched } = useMovies('watched');
    const { movies: willWatchMovies, isLoading: isLoadingWillWatch } = useMovies('will_watch');
    const { movies: searchMovies, isLoading: isLoadingSearch } = useMovies(undefined, debouncedQuery);

    // Determine which movies to show
    let movies = allMovies;
    let isLoading = isLoadingAll;

    if (debouncedQuery) {
        movies = searchMovies;
        isLoading = isLoadingSearch;
    } else if (watchStatus === 'watched') {
        movies = watchedMovies;
        isLoading = isLoadingWatched;
    } else if (watchStatus === 'will_watch') {
        movies = willWatchMovies;
        isLoading = isLoadingWillWatch;
    }

    // Sort movies
    const sortedMovies = [...movies].sort((a, b) => {
        let comparison = 0;

        switch (sortBy) {
            case 'title':
                comparison = a.title.localeCompare(b.title);
                break;
            case 'rating':
                const ratingA = a.user_rating || 0;
                const ratingB = b.user_rating || 0;
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

    const filterOptions = [
        { value: 'all', label: 'All Movies', count: allMovies.length },
        { value: 'will_watch', label: 'Will Watch', count: willWatchMovies.length },
        { value: 'watched', label: 'Watched', count: watchedMovies.length },
    ];

    const sortOptions = [
        { value: 'updated', label: 'Recently Updated' },
        { value: 'date_added', label: 'Date Added' },
        { value: 'title', label: 'Title' },
        { value: 'rating', label: 'Rating' },
    ];

    return (
        <div className="space-y-6">
            {/* Filters and Search */}
            <div className="flex flex-col sm:flex-row gap-4">
                {/* Search */}
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                    <Input
                        placeholder="Search your movies..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-10"
                    />
                </div>

                {/* Filter by Status */}
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="outline" className="gap-2">
                            <Filter className="w-4 h-4" />
                            {filterOptions.find(f => f.value === watchStatus)?.label}
                            <Badge variant="secondary" className="ml-1">
                                {filterOptions.find(f => f.value === watchStatus)?.count}
                            </Badge>
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Filter by Status</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        {filterOptions.map((option) => (
                            <DropdownMenuItem
                                key={option.value}
                                onClick={() => setWatchStatus(option.value as WatchStatus)}
                                className="justify-between"
                            >
                                {option.label}
                                <Badge variant="secondary">{option.count}</Badge>
                            </DropdownMenuItem>
                        ))}
                    </DropdownMenuContent>
                </DropdownMenu>

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

            {/* Movie List */}
            {isLoading ? (
                <div className="space-y-3">
                    {Array.from({ length: 4 }).map((_, i) => (
                        <div key={i} className="h-28 bg-muted rounded-lg animate-pulse"></div>
                    ))}
                </div>
            ) : sortedMovies.length > 0 ? (
                <div className="space-y-3">
                    {sortedMovies.map((movie) => (
                        <MovieCard key={movie.id} movie={movie} />
                    ))}
                </div>
            ) : (
                <div className="text-center py-12">
                    <div className="text-muted-foreground">
                        {debouncedQuery ? (
                            <>No movies found for "{debouncedQuery}"</>
                        ) : watchStatus === 'all' ? (
                            <>No movies in your collection yet</>
                        ) : watchStatus === 'watched' ? (
                            <>No watched movies yet</>
                        ) : (
                            <>No movies in your watchlist yet</>
                        )}
                    </div>
                    {!debouncedQuery && (
                        <p className="text-sm text-muted-foreground mt-2">
                            Search for movies above to start building your collection!
                        </p>
                    )}
                </div>
            )}
        </div>
    );
}
