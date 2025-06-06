import { useFilteredData } from './use-filtered-data'
import { HabitEntry } from '@/lib/db/schema'
import { useMemo } from 'react'

export function useHabitEntries(habitId?: number) {
    const { data: response, isError, isLoading, mutate } = useFilteredData<{ success: boolean; data: HabitEntry[] }>(
        {
            endpoint: '/api/habit-entries',
            params: habitId ? { habit_id: habitId } : undefined
        }
    )

    const memoizedEntries = useMemo(() => {
        // Extract entries from the wrapped response
        return response?.data || []
    }, [response])

    return {
        entries: memoizedEntries,
        isLoading,
        isError: !!isError,
        mutate,
    }
}

// Hook to calculate habit regularity percentage
export function useHabitRegularity(habitId: number, frequency: string, targetCount: number) {
    const { entries } = useHabitEntries(habitId)

    const regularityPercentage = useMemo(() => {
        if (!entries || entries.length === 0) return 0

        const now = new Date()
        let daysToCheck = 7 // Default to weekly view

        // Adjust days based on frequency
        switch (frequency) {
            case 'daily':
                daysToCheck = 7 // Check last 7 days
                break
            case 'weekly':
                daysToCheck = 28 // Check last 4 weeks
                break
            case 'monthly':
                daysToCheck = 90 // Check last 3 months
                break
            case 'yearly':
                daysToCheck = 365 // Check last year
                break
        }

        // Calculate expected completions based on frequency
        let expectedCompletions = 0
        switch (frequency) {
            case 'daily':
                expectedCompletions = daysToCheck * targetCount
                break
            case 'weekly':
                expectedCompletions = Math.floor(daysToCheck / 7) * targetCount
                break
            case 'monthly':
                expectedCompletions = Math.floor(daysToCheck / 30) * targetCount
                break
            case 'yearly':
                expectedCompletions = Math.floor(daysToCheck / 365) * targetCount
                break
        }

        // Count actual completions in the period
        const cutoffDate = new Date(now.getTime() - (daysToCheck * 24 * 60 * 60 * 1000))
        interface RecentEntry extends HabitEntry {
            date: Date
            count: number
        }

        const recentEntries: RecentEntry[] = entries.filter((entry: HabitEntry): entry is RecentEntry => 
            new Date(entry.date) >= cutoffDate
        )

        const actualCompletions = recentEntries.reduce((sum, entry) => sum + entry.count, 0)

        // Calculate percentage (cap at 100%)
        const percentage = expectedCompletions > 0 
            ? Math.min(100, Math.round((actualCompletions / expectedCompletions) * 100))
            : 0

        return percentage
    }, [entries, frequency, targetCount])

    return regularityPercentage
}
