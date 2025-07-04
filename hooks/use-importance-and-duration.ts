"use client"

import { useFilteredData } from "./use-filtered-data"
import type { Importance, Duration } from "@/lib/db/schema"

interface UseImportanceAndDurationParams {
    skipFetch?: boolean
}

export function useImportanceAndDuration(params: UseImportanceAndDurationParams = {}) {
    const { skipFetch = false } = params
    
    const {
        data: importanceData,
        isLoading: isLoadingImportance,
        isError: isErrorImportance,
    } = useFilteredData<Importance[]>({
        endpoint: "/api/importance",
        params: {},
        skipFetch,
    })

    const {
        data: durationData,
        isLoading: isLoadingDuration,
        isError: isErrorDuration,
    } = useFilteredData<Duration[]>({
        endpoint: "/api/duration",
        params: {},
        skipFetch,
    })

    return {
        data: {
            importance: (importanceData as Importance[]) || [],
            duration: (durationData as Duration[]) || [],
        },
        isLoading: isLoadingImportance || isLoadingDuration,
        isError: isErrorImportance || isErrorDuration,
        importanceData: (importanceData as Importance[]) || [], // Keep backward compatibility
        durationData: (durationData as Duration[]) || [], // Keep backward compatibility
        isLoadingImportance,
        isLoadingDuration,
        isErrorImportance,
        isErrorDuration,
    }
}
