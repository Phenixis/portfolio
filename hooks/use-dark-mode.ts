"use client"

import { useFilteredData } from "./use-filtered-data"
import { DarkModeCookie } from "@/lib/flags"

export function useDarkMode() {
    const { data, isLoading, isError, mutate } = useFilteredData({
        endpoint: "/api/dark-mode",
        params: {},
    })

    return {
        darkMode: (data?.darkModeCookie ?? null) as DarkModeCookie | null,
        isLoading,
        isError,
        mutate,
    }
}