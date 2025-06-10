"use client"

import { useFilteredData } from "./use-filtered-data"
import type { HabitFrequency } from "@/lib/types/habits"
import { useState } from "react"

export function useProgressCycle({
    defaultFrequency = "daily",
    date = new Date(),
    skipFetch = false,
} : {
    defaultFrequency?: HabitFrequency,
    date?: Date,
    skipFetch?: boolean
}) {
    const [frequency, setFrequency] = useState<HabitFrequency>(defaultFrequency)

    const { data, isLoading, isError } = useFilteredData({
        endpoint: '/api/habits/progress',
        params: {
            frequency,
            date: date.toISOString(),
        },
        skipFetch,
    })

    return {
        frequency,
        setFrequency,
        data,
        isLoading,
        isError,
    }
}

