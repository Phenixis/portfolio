import { useFilteredData } from './use-filtered-data'
import { Habit } from '@/lib/db/schema'

export function useHabits() {
    const { data: habits, isError, isLoading, mutate } = useFilteredData<Habit[]>(
        {
            endpoint: '/api/habits'
        }
    )

    return {
        habits: habits || [],
        isLoading,
        isError: !!isError,
        mutate,
    }
}
