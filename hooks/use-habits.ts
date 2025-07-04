"use client"

import { useFilteredData } from "./use-filtered-data"
import type { Habit } from "@/lib/db/schema"

// Type for the API response structure
interface HabitsApiResponse {
    habits: Habit[]
}

interface UseHabitsParams {
    frequency?: string
    activeOnly?: boolean
    skipFetch?: boolean
}

export function useHabits(params: UseHabitsParams = {}) {
    const { frequency, activeOnly = true, skipFetch = false } = params

    const { data, isLoading, isError } = useFilteredData<HabitsApiResponse>({
        endpoint: '/api/habits',
        params: {
            frequency,
            activeOnly,
        },
        skipFetch,
    })

    return {
        data: data?.habits as Habit[] || [],
        isLoading,
        isError,
        habits: data?.habits as Habit[] || [], // Keep backward compatibility
    }
}