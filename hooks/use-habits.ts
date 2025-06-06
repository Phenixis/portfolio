import { useFilteredData } from './use-filtered-data'
import { Habit } from '@/lib/db/schema'
import { useMemo, useEffect } from 'react'

export function useHabits() {
    const { data: habits, isError, isLoading, mutate } = useFilteredData<Habit[]>(
        {
            endpoint: '/api/habits'
        }
    )

    // Debug logging to help track data changes
    useEffect(() => {
        console.log('Habits data changed:', { 
            habitsCount: habits?.length || 0, 
            isLoading, 
            isError: !!isError,
            firstHabit: habits?.[0]?.title || 'none'
        })
    }, [habits, isLoading, isError])

    // Memoize habits to ensure stable reference and force re-render on data change
    const memoizedHabits = useMemo(() => {
        return habits || []
    }, [habits])

    return {
        habits: memoizedHabits,
        isLoading,
        isError: !!isError,
        mutate,
    }
}
