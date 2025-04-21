"use client"

import { useFilteredData } from "./use-filtered-data"
import type { Importance, Duration } from "@/lib/db/schema"

export function useImportanceAndDuration() {
    const {
        data: importanceData,
        isLoading: isLoadingImportance,
        isError: isErrorImportance,
    } = useFilteredData<Importance[]>({
        endpoint: "/api/importance",
        params: {},
    })

    const {
        data: durationData,
        isLoading: isLoadingDuration,
        isError: isErrorDuration,
    } = useFilteredData<Duration[]>({
        endpoint: "/api/duration",
        params: {},
    })

    return {
        importanceData: (importanceData as Importance[]) || [],
        durationData: (durationData as Duration[]) || [],
        isLoadingImportance,
        isLoadingDuration,
        isErrorImportance,
        isErrorDuration,
    }
}
