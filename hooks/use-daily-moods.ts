"use client"

import type { DailyMood } from "@/lib/db/schema"
import { useFilteredData } from "./use-filtered-data"

// hooks/use--number-of-tasks.ts
export function useDailyMoods({
    startDate,
    endDate,
    enabled=true,
}: {
    startDate: Date
    endDate: Date
    enabled?: boolean
}) {
    const { data, isLoading, isError, mutate } = useFilteredData<DailyMood[]>({
        endpoint: "/api/mood",
        params: {
            startDate: startDate.toISOString(),
            endDate: endDate.toISOString(),
        },
        skipFetch: !enabled,
    })

    return {
        data: data as DailyMood[] || [],
        isLoading,
        isError,
        mutate,
    }
}
