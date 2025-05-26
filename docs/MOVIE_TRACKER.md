# Movie Tracker Documentation

## Overview

The Movie Tracker is a comprehensive feature that allows users to track, rate, and manage their movie and TV show watchlist using data from The Movie Database (TMDb) API. Users can search for movies/TV shows, add them to their personal list, rate them from 0.5 to 5.0 (in 0.5 increments), add comments, and mark their watch status.

## Features

### Core Features
- **Search Movies & TV Shows**: Search TMDb database for movies and TV shows
- **Personal Watchlist**: Add movies/shows to "Will Watch" or "Watched" lists
- **Rating System**: Rate content from 0.5 to 5.0 stars in 0.5 increments
- **Comments**: Add personal comments and reviews
- **Statistics**: View watching statistics and analytics
- **Responsive Design**: Works on all screen sizes

### Search Functionality
- Search by title across movies and TV shows
- Filter results by media type (movies, TV shows, or both)
- Pagination support for large result sets
- Real-time search results

### Rating & Review System
- Star rating system with half-star precision (0.5 - 5.0)
- Personal comments and reviews
- **Combined editing interface** for rating and comment in a single action
- Visual rating display with interactive stars
- Minimalist card design for better user experience

### Watch Status Management
- "Will Watch": Movies/shows planned to watch
- "Watched": Completed movies/shows with optional watched date
- Easy status switching between categories
- Automatic watched date tracking

## File Structure

```
/app/(back-office)/my/tools/movie-tracker/
├── page.tsx                    # Main movie tracker page

/components/big/movie-tracker/
├── movie-search.tsx           # Search interface component
├── movie-card.tsx             # Individual movie display card
├── movie-list.tsx             # List of movies with filtering
└── movie-stats.tsx            # Statistics dashboard

/lib/services/
└── tmdb.ts                    # TMDb API service

/lib/db/queries/
└── movies.ts                  # Database operations for movies

/hooks/
└── use-movies.ts              # React hooks for movie data

/app/(api)/api/movie/
├── route.ts                   # CRUD operations (POST, PUT, DELETE)
├── search/route.ts            # TMDb search API endpoint
├── list/route.ts              # Get user's movie list
└── stats/route.ts             # Get user statistics
```

## Database Schema

The movie tracker uses a `movie` table with the following structure:

```sql
CREATE TABLE movie (
    id SERIAL PRIMARY KEY,
    user_id CHAR(8) NOT NULL,
    tmdb_id INTEGER NOT NULL,
    media_type VARCHAR(10) NOT NULL, -- 'movie' or 'tv'
    title VARCHAR(500) NOT NULL,
    overview TEXT,
    poster_path VARCHAR(200),
    backdrop_path VARCHAR(200),
    release_date DATE,
    vote_average DECIMAL(3,1),
    vote_count INTEGER,
    popularity DECIMAL(8,3),
    original_language VARCHAR(10),
    genres JSON,
    runtime INTEGER,
    status VARCHAR(50),
    user_rating DECIMAL(2,1), -- 0.5 to 5.0
    user_comment TEXT,
    watch_status VARCHAR(20) DEFAULT 'will_watch',
    watched_date TIMESTAMP,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    deleted_at TIMESTAMP
);
```

## API Endpoints

### Movie Search
```http
GET /api/movie/search?query={searchTerm}&type={mediaType}&page={pageNumber}
```
- Search TMDb for movies and TV shows
- Authentication required
- Returns paginated search results

### User's Movie List
```http
GET /api/movie/list?status={watchStatus}&page={pageNumber}&limit={itemsPerPage}
```
- Get user's personal movie list
- Optional filtering by watch status
- Supports pagination and sorting

### Add Movie
```http
POST /api/movie
{
    "tmdb_id": 27205,
    "media_type": "movie",
    "watch_status": "will_watch"
}
```
- Add movie/show to user's list
- Fetches details from TMDb automatically

### Update Movie
```http
PUT /api/movie
{
    "movie_id": 123,
    "user_rating": 4.5,
    "user_comment": "Great movie!",
    "watch_status": "watched",
    "watched_date": "2025-05-26"
}
```
- Update rating, comment, or watch status
- All fields optional

### Delete Movie
```http
DELETE /api/movie?id={movieId}
```
- Remove movie from user's list

### Statistics
```http
GET /api/movie/stats
```
- Get user's watching statistics
- Returns counts, averages, and analytics

## TMDb Integration

### Authentication
The application uses TMDb API v3 with Bearer token authentication:
```typescript
headers: {
    'Authorization': `Bearer ${TMDB_ACCESS_TOKEN}`,
    'Content-Type': 'application/json',
}
```

### Environment Variables
Required environment variable:
```env
TMDB_ACCESS_TOKEN=your_tmdb_bearer_token_here
```

### Supported Operations
- Multi-search (movies + TV shows)
- Movie-specific search
- TV show-specific search
- Detailed movie information
- Detailed TV show information
- Image URL generation

## Components

### MovieSearch
Interactive search component with:
- Real-time search input
- Media type filtering (All, Movies, TV Shows)
- Search results grid
- Add to list functionality

### MovieCard
Displays individual movie/show with:
- **Minimalist compact design** with smaller poster (16x24px)
- Title and release date with hover effects
- Rating (TMDb + user rating) with "Not rated" indicator
- Overview text with line clamping
- **Single edit mode** for both rating and comment
- Action buttons (Add, Edit, Remove) with hover reveal
- Star rating interface with improved visual feedback

### MovieList
Manages user's movie collection:
- Tabbed interface (Will Watch, Watched)
- Sorting options (Title, Date Added, Rating, Release Date)
- Filtering capabilities
- Pagination support

### MovieStats
Statistics dashboard showing:
- Total movies/shows tracked
- Average user rating
- Watch status breakdown
- Recent activity

## Usage Examples

### Search and Add Movie
```typescript
// Search for movies
const searchResults = await fetch('/api/movie/search?query=inception&type=movie');

// Add to watchlist
await fetch('/api/movie', {
    method: 'POST',
    body: JSON.stringify({
        tmdb_id: 27205,
        media_type: 'movie',
        watch_status: 'will_watch'
    })
});
```

### Rate a Movie
```typescript
await fetch('/api/movie', {
    method: 'PUT',
    body: JSON.stringify({
        movie_id: 123,
        user_rating: 4.5,
        user_comment: 'Excellent movie with great plot twists!',
        watch_status: 'watched'
    })
});
```

### Using React Hooks
```typescript
import { useMovies, useMovieSearch } from '@/hooks/use-movies';

function MovieComponent() {
    const { movies, isLoading, error } = useMovies('watched');
    const { searchMovies, searchResults } = useMovieSearch();
    
    // Component logic here
}
```

## Development Notes

### Authentication
All API routes use `verifyRequest` from `/lib/auth/api` for user authentication. Each request must include a valid session cookie.

### Error Handling
- TMDb API errors are caught and returned with appropriate HTTP status codes
- Database errors are handled gracefully
- Client-side error boundaries prevent crashes

### Performance Optimizations
- SWR for efficient data fetching and caching
- Optimistic updates for better UX
- Image lazy loading
- Pagination for large datasets

### Accessibility
- ARIA labels on interactive elements
- Keyboard navigation support
- Screen reader friendly
- High contrast mode compatible

## Testing

### Manual Testing Checklist
- [ ] Search functionality works for movies and TV shows
- [ ] Adding movies to watchlist
- [ ] Rating movies with star interface
- [ ] Adding/editing comments
- [ ] Changing watch status
- [ ] Statistics display correctly
- [ ] Responsive design on mobile

### Environment Setup
1. Ensure TMDB_ACCESS_TOKEN is set in environment variables
2. Run database migrations: `pnpm db:migrate`
3. Start development server: `pnpm dev`
4. Navigate to `/my/tools/movie-tracker`

## Troubleshooting

### Common Issues

**TMDb API Not Working**
- Check TMDB_ACCESS_TOKEN is correctly set
- Verify token has read permissions
- Check network connectivity

**Database Errors**
- Ensure migrations are up to date
- Check database connection string
- Verify user permissions

**Authentication Issues**
- Check session cookie is set
- Verify user is logged in
- Check middleware configuration

### Debug Mode
Enable debug logging by setting:
```env
NODE_ENV=development
```

## Future Improvements

### Planned Features
1. Movie recommendations based on ratings
2. Social features (sharing lists, following friends)
3. Export/import functionality
4. Advanced filtering and search
5. Movie collection statistics and insights
6. Integration with external services (Netflix, Prime Video)

### Performance Enhancements
1. Image optimization and caching
2. Database query optimization
3. Client-side caching improvements
4. Background sync for offline support

### UI/UX Improvements
1. Dark mode enhancements
2. Customizable list views
3. Drag-and-drop sorting
4. Bulk operations
5. Advanced search filters
