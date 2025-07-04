"use client"

import type { DailyMood } from "@/lib/db/schema"
import { useFilteredData } from "./use-filtered-data"

interface UseDailyMoodsParams {
    startDate: Date
    endDate: Date
    enabled?: boolean
}

// hooks/use-daily-moods.ts
export function useDailyMoods(params: UseDailyMoodsParams) {
    const { startDate, endDate, enabled = true } = params

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
        dailyMoods: data as DailyMood[] || [], // Keep backward compatibility
    }
}
