"use client"

import type { DailyMood } from "@/lib/db/schema"
import { useFilteredData } from "./use-filtered-data"

// hooks/use--number-of-tasks.ts
export function useDailyMoods({
    enabled,
    startDate,
    endDate,
}: {
    startDate: Date
    endDate: Date
    enabled?: boolean
}) {
    const { data, isLoading, isError, mutate } = useFilteredData<DailyMood[]>({
        endpoint: "/api/mood",
        params: {
            startDate: new Date(startDate.getFullYear(), startDate.getMonth(), startDate.getDate()).toISOString(),
            endDate: new Date(endDate.getFullYear(), endDate.getMonth(), endDate.getDate()).toISOString(),
        },
        skipFetch: !enabled,
    })

    return {
        data: data || [],
        isLoading,
        isError,
        mutate,
    }
}
