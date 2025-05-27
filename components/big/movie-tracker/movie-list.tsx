'use client';

import { useState, useEffect, useCallback } from 'react';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { MovieCard } from './movie-card';
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
import {
    Pagination,
    PaginationContent,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from '@/components/ui/pagination';

type SortBy = 'updated' | 'title' | 'rating' | 'date_added';
type SortOrder = 'asc' | 'desc';

const ITEMS_PER_PAGE = 10;

interface MovieListProps {
    status?: 'watched';
}

export function MovieList({ status }: MovieListProps) {
    const searchParams = useSearchParams();
    const router = useRouter();
    const pathname = usePathname();
    
    // Initialize states from search params
    const [searchQuery, setSearchQuery] = useState(searchParams.get('movies_search') || '');
    const [sortBy, setSortBy] = useState<SortBy>((searchParams.get('movies_sort') as SortBy) || 'updated');
    const [sortOrder, setSortOrder] = useState<SortOrder>((searchParams.get('movies_order') as SortOrder) || 'desc');
    const [currentPage, setCurrentPage] = useState(parseInt(searchParams.get('movies_page') || '1'));
    const [debouncedQuery] = useDebounce(searchQuery, 300);

    // Update search params when states change
    const updateSearchParams = useCallback((updates: Record<string, string | number>) => {
        const params = new URLSearchParams(searchParams.toString());
        
        Object.entries(updates).forEach(([key, value]) => {
            if (value === '' || value === null || value === undefined) {
                params.delete(key);
            } else {
                params.set(key, value.toString());
            }
        });
        
        router.replace(`${pathname}?${params.toString()}`, { scroll: false });
    }, [searchParams, router, pathname]);

    // Update URL when search query changes
    useEffect(() => {
        updateSearchParams({ movies_search: searchQuery });
    }, [searchQuery, updateSearchParams]);

    // Update URL when sort changes
    useEffect(() => {
        updateSearchParams({ movies_sort: sortBy });
    }, [sortBy, updateSearchParams]);

    // Update URL when sort order changes
    useEffect(() => {
        updateSearchParams({ movies_order: sortOrder });
    }, [sortOrder, updateSearchParams]);

    // Update URL when page changes
    useEffect(() => {
        updateSearchParams({ movies_page: currentPage });
    }, [currentPage, updateSearchParams]);

    // Update states when search params change (browser back/forward)
    useEffect(() => {
        const searchFromParams = searchParams.get('movies_search') || '';
        const sortFromParams = (searchParams.get('movies_sort') as SortBy) || 'updated';
        const orderFromParams = (searchParams.get('movies_order') as SortOrder) || 'desc';
        const pageFromParams = parseInt(searchParams.get('movies_page') || '1');
        
        if (searchFromParams !== searchQuery) setSearchQuery(searchFromParams);
        if (sortFromParams !== sortBy) setSortBy(sortFromParams);
        if (orderFromParams !== sortOrder) setSortOrder(orderFromParams);
        if (pageFromParams !== currentPage) setCurrentPage(pageFromParams);
    }, [searchParams, searchQuery, sortBy, sortOrder, currentPage]);

    // Since this component is only used for watched movies, we only need the watched movies
    const { movies: watchedMovies, isLoading } = useMovies(status || 'watched');
    const { movies: searchMovies, isLoading: isLoadingSearch } = useMovies(status || 'watched', debouncedQuery);

    // Use search results if there's a query, otherwise use watched movies
    const movies = debouncedQuery ? searchMovies : watchedMovies;
    const actualIsLoading = debouncedQuery ? isLoadingSearch : isLoading;

    // Reset to first page when search changes
    useEffect(() => {
        setCurrentPage(1);
    }, [debouncedQuery]);

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

    // Calculate pagination
    const totalItems = sortedMovies.length;
    const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    const paginatedMovies = sortedMovies.slice(startIndex, endIndex);

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
                        placeholder="Search your watched movies..."
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

            {/* Movie List */}
            {actualIsLoading ? (
                <div className="space-y-3">
                    {Array.from({ length: 4 }).map((_, i) => (
                        <div key={i} className="h-28 bg-muted rounded-lg animate-pulse"></div>
                    ))}
                </div>
            ) : paginatedMovies.length > 0 ? (
                <>
                    <div className="space-y-3">
                        {paginatedMovies.map((movie) => (
                            <MovieCard key={movie.id} movie={movie} />
                        ))}
                    </div>
                    
                    {/* Pagination */}
                    {totalPages > 1 && (
                        <div className="flex justify-center">
                            <Pagination>
                                <PaginationContent>
                                    <PaginationItem>
                                        <PaginationPrevious 
                                            href="#"
                                            onClick={(e) => {
                                                e.preventDefault();
                                                if (currentPage > 1) {
                                                    setCurrentPage(currentPage - 1);
                                                }
                                            }}
                                            className={currentPage <= 1 ? 'pointer-events-none opacity-50' : ''}
                                        />
                                    </PaginationItem>
                                    
                                    {Array.from({ length: totalPages }, (_, i) => i + 1)
                                        .filter(page => {
                                            // Show first page, last page, current page, and pages around current
                                            return page === 1 || 
                                                   page === totalPages || 
                                                   Math.abs(page - currentPage) <= 1;
                                        })
                                        .map((page, index, array) => {
                                            const prevPage = array[index - 1];
                                            const showEllipsis = prevPage && page - prevPage > 1;
                                            
                                            return (
                                                <PaginationItem key={page}>
                                                    {showEllipsis && (
                                                        <span className="px-4 py-2 text-muted-foreground">...</span>
                                                    )}
                                                    <PaginationLink
                                                        href="#"
                                                        onClick={(e) => {
                                                            e.preventDefault();
                                                            setCurrentPage(page);
                                                        }}
                                                        isActive={currentPage === page}
                                                    >
                                                        {page}
                                                    </PaginationLink>
                                                </PaginationItem>
                                            );
                                        })}
                                    
                                    <PaginationItem>
                                        <PaginationNext 
                                            href="#"
                                            onClick={(e) => {
                                                e.preventDefault();
                                                if (currentPage < totalPages) {
                                                    setCurrentPage(currentPage + 1);
                                                }
                                            }}
                                            className={currentPage >= totalPages ? 'pointer-events-none opacity-50' : ''}
                                        />
                                    </PaginationItem>
                                </PaginationContent>
                            </Pagination>
                        </div>
                    )}
                </>
            ) : (
                <div className="text-center py-12">
                    <div className="text-muted-foreground">
                        {debouncedQuery ? (
                            <>No movies found for &quot;{debouncedQuery}&quot;</>
                        ) : (
                            <>No watched movies yet</>
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
