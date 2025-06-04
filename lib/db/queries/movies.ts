import { db } from '@/lib/db/drizzle';
import { movie, notInterestedMovie, type Movie, type NewMovie, type NotInterestedMovie, type NewNotInterestedMovie } from '@/lib/db/schema';
import { eq, and, desc, sql } from 'drizzle-orm';

/**
 * Movie database operations
 */
export class MovieQueries {
    /**
     * Get all movies for a user
     */
    static async getUserMovies(userId: string): Promise<Movie[]> {
        return await db
            .select()
            .from(movie)
            .where(and(
                eq(movie.user_id, userId),
                sql`${movie.deleted_at} IS NULL`
            ))
            .orderBy(desc(movie.updated_at));
    }

    /**
     * Get movies by watch status
     */
    static async getMoviesByStatus(userId: string, watchStatus: 'will_watch' | 'watched' | 'watch_again'): Promise<Movie[]> {
        return await db
            .select()
            .from(movie)
            .where(and(
                eq(movie.user_id, userId),
                eq(movie.watch_status, watchStatus),
                sql`${movie.deleted_at} IS NULL`
            ))
            .orderBy(desc(movie.updated_at));
    }

    /**
     * Get movie by TMDb ID for a user
     */
    static async getMovieByTmdbId(userId: string, tmdbId: number, mediaType: 'movie' | 'tv'): Promise<Movie | null> {
        const results = await db
            .select()
            .from(movie)
            .where(and(
                eq(movie.user_id, userId),
                eq(movie.tmdb_id, tmdbId),
                eq(movie.media_type, mediaType),
                sql`${movie.deleted_at} IS NULL`
            ))
            .limit(1);

        return results[0] || null;
    }

    /**
     * Get movie by ID
     */
    static async getMovieById(movieId: number): Promise<Movie | null> {
        const results = await db
            .select()
            .from(movie)
            .where(and(
                eq(movie.id, movieId),
                sql`${movie.deleted_at} IS NULL`
            ))
            .limit(1);

        return results[0] || null;
    }

    /**
     * Add a new movie to user's list
     */
    static async addMovie(movieData: NewMovie): Promise<Movie> {
        const results = await db
            .insert(movie)
            .values({
                ...movieData,
                created_at: new Date(),
                updated_at: new Date()
            })
            .returning();

        return results[0];
    }

    /**
     * Update movie rating and comment
     */
    static async updateMovieRating(
        movieId: number, 
        userId: string,
        rating: number | null, 
        comment: string | null
    ): Promise<Movie | null> {
        const results = await db
            .update(movie)
            .set({
                user_rating: rating,
                user_comment: comment,
                updated_at: new Date()
            })
            .where(and(
                eq(movie.id, movieId),
                eq(movie.user_id, userId),
                sql`${movie.deleted_at} IS NULL`
            ))
            .returning();

        return results[0] || null;
    }

    /**
     * Update movie watch status
     */
    static async updateWatchStatus(
        movieId: number,
        userId: string,
        watchStatus: 'will_watch' | 'watched' | 'watch_again',
        watchedDate?: Date
    ): Promise<Movie | null> {
        const updateData: Partial<Movie> = {
            watch_status: watchStatus,
            updated_at: new Date()
        };

        if (watchStatus === 'watched' && watchedDate) {
            updateData.watched_date = watchedDate;
        } else if (watchStatus === 'watch_again' && watchedDate) {
            updateData.watched_date = watchedDate;
        } else if (watchStatus === 'will_watch') {
            updateData.watched_date = null;
        }

        const results = await db
            .update(movie)
            .set(updateData)
            .where(and(
                eq(movie.id, movieId),
                eq(movie.user_id, userId),
                sql`${movie.deleted_at} IS NULL`
            ))
            .returning();

        return results[0] || null;
    }

    /**
     * Delete a movie (soft delete)
     */
    static async deleteMovie(movieId: number, userId: string): Promise<boolean> {
        const results = await db
            .update(movie)
            .set({
                deleted_at: new Date(),
                updated_at: new Date()
            })
            .where(and(
                eq(movie.id, movieId),
                eq(movie.user_id, userId),
                sql`${movie.deleted_at} IS NULL`
            ))
            .returning();

        return results.length > 0;
    }

    /**
     * Get user's movie statistics
     */
    static async getMovieStats(userId: string): Promise<{
        total: number;
        watched: number;
        willWatch: number;
        watchAgain: number;
        averageRating: number | null;
    }> {
        const stats = await db
            .select({
                total: sql<number>`COUNT(*)`,
                watched: sql<number>`COUNT(CASE WHEN ${movie.watch_status} = 'watched' THEN 1 END)`,
                willWatch: sql<number>`COUNT(CASE WHEN ${movie.watch_status} = 'will_watch' THEN 1 END)`,
                watchAgain: sql<number>`COUNT(CASE WHEN ${movie.watch_status} = 'watch_again' THEN 1 END)`,
                averageRating: sql<number>`AVG(${movie.user_rating})`
            })
            .from(movie)
            .where(and(
                eq(movie.user_id, userId),
                sql`${movie.deleted_at} IS NULL`
            ));

        return {
            total: stats[0].total,
            watched: stats[0].watched,
            willWatch: stats[0].willWatch,
            watchAgain: stats[0].watchAgain,
            averageRating: stats[0].averageRating
        };
    }

    /**
     * Search user's movies by title
     */
    static async searchUserMovies(userId: string, searchTerm: string): Promise<Movie[]> {
        return await db
            .select()
            .from(movie)
            .where(and(
                eq(movie.user_id, userId),
                sql`${movie.title} ILIKE ${'%' + searchTerm + '%'}`,
                sql`${movie.deleted_at} IS NULL`
            ))
            .orderBy(desc(movie.updated_at));
    }

    /**
     * Mark a movie as "not interested"
     */
    static async markAsNotInterested(
        userId: string,
        tmdbId: number,
        mediaType: 'movie' | 'tv',
        title: string
    ): Promise<NotInterestedMovie> {
        const newNotInterestedMovie: NewNotInterestedMovie = {
            user_id: userId,
            tmdb_id: tmdbId,
            media_type: mediaType,
            title: title
        };

        const result = await db
            .insert(notInterestedMovie)
            .values(newNotInterestedMovie)
            .returning();

        return result[0];
    }

    /**
     * Remove a movie from "not interested" list
     */
    static async removeFromNotInterested(
        userId: string,
        tmdbId: number,
        mediaType: 'movie' | 'tv'
    ): Promise<void> {
        await db
            .delete(notInterestedMovie)
            .where(and(
                eq(notInterestedMovie.user_id, userId),
                eq(notInterestedMovie.tmdb_id, tmdbId),
                eq(notInterestedMovie.media_type, mediaType)
            ));
    }

    /**
     * Get all not interested movie IDs for a user (for exclusion from recommendations)
     */
    static async getNotInterestedMovieIds(userId: string): Promise<number[]> {
        const results = await db
            .select({ tmdb_id: notInterestedMovie.tmdb_id })
            .from(notInterestedMovie)
            .where(eq(notInterestedMovie.user_id, userId));

        return results.map(result => result.tmdb_id);
    }

    /**
     * Check if a movie is marked as "not interested"
     */
    static async isNotInterested(
        userId: string,
        tmdbId: number,
        mediaType: 'movie' | 'tv'
    ): Promise<boolean> {
        const result = await db
            .select()
            .from(notInterestedMovie)
            .where(and(
                eq(notInterestedMovie.user_id, userId),
                eq(notInterestedMovie.tmdb_id, tmdbId),
                eq(notInterestedMovie.media_type, mediaType)
            ))
            .limit(1);

        return result.length > 0;
    }
}

export default MovieQueries;
