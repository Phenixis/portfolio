'use client';

import { useState } from 'react';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, Search, BarChart3, Sparkles, Eye } from 'lucide-react';
import { MovieStats } from '@/components/big/movie-tracker/movie-stats';
import { MovieSearch } from '@/components/big/movie-tracker/movie-search';
import { MovieList } from '@/components/big/movie-tracker/movie-list';
import { WatchlistGrid } from '@/components/big/movie-tracker/watchlist-grid';
import { DiscoverMovies } from '@/components/big/movie-tracker/discover-movies';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';

export default function MovieTrackerPage() {
    const [showSearchDialog, setShowSearchDialog] = useState(false);
    const searchParams = useSearchParams();
    const router = useRouter();
    const pathname = usePathname();
    
    // Simple approach: directly use searchParams for active tab
    const currentTab = searchParams.get('tab') || 'movies';
    const validTabs = ['movies', 'watchlist', 'discover'];
    const activeTab = validTabs.includes(currentTab) ? currentTab : 'movies';

    // Simple tab change handler - just update the URL
    const handleTabChange = (newTab: string) => {
        const params = new URLSearchParams(searchParams);
        params.set('tab', newTab);
        router.replace(`${pathname}?${params.toString()}`);
    };

    const handleMovieAdded = () => {
        setShowSearchDialog(false);
        // The movie list will automatically refresh due to SWR
    };

    return (
        <div className="container mx-auto p-6 space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold">Movie Tracker</h1>
                    <p className="text-muted-foreground">
                        Track, rate, and organize your movie and TV show collection
                    </p>
                </div>
                
                <Dialog open={showSearchDialog} onOpenChange={setShowSearchDialog}>
                    <DialogTrigger asChild>
                        <Button className="gap-2">
                            <Plus className="w-4 h-4" />
                            Add Movie
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
                        <DialogHeader>
                            <DialogTitle className="flex items-center gap-2">
                                <Search className="w-5 h-5" />
                                Search Movies & TV Shows
                            </DialogTitle>
                        </DialogHeader>
                        <MovieSearch onMovieAdded={handleMovieAdded} />
                    </DialogContent>
                </Dialog>
            </div>

            {/* Stats */}
            <MovieStats />

            {/* Main Content */}
            <Tabs value={activeTab} onValueChange={handleTabChange} className="space-y-6">
                <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="movies" className="gap-2">
                        <Search className="w-4 h-4" />
                        My Movies
                    </TabsTrigger>
                    <TabsTrigger value="watchlist" className="gap-2">
                        <Eye className="w-4 h-4" />
                        Watchlist
                    </TabsTrigger>
                    <TabsTrigger value="discover" className="gap-2">
                        <Sparkles className="w-4 h-4" />
                        Discover
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="movies" className="space-y-6">
                    <Card>
                        <CardHeader className="pb-2">
                            <CardTitle>Watched Movies</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <MovieList status="watched" />
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="watchlist" className="space-y-6">
                    <Card>
                        <CardHeader className="pb-2">
                            <CardTitle>Your Watchlist</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <WatchlistGrid />
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="discover" className="space-y-6">
                    <DiscoverMovies />
                </TabsContent>
            </Tabs>
        </div>
    );
}