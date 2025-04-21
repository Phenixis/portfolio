"use client"

import type { Task } from "@/lib/db/schema"
import { useFilteredData } from "./use-filtered-data"

export function useSearchTasks({
  query,
  limit,
}: {
  query?: string
  limit?: number
}) {
    // Only create a SWR key if query has a value
    const shouldFetch = query !== undefined && query !== ""
    
    const { data, isLoading, isError, mutate } = useFilteredData<Task[]>({
        endpoint: "/api/task/search",
        params: {
        query,
        limit,
        },
        // Skip fetching if query is empty
        skipFetch: !shouldFetch,
    })
    
    return {
        tasks: (data as Task[]) || [],
        isLoading,
        isError,
        mutate,
    }
}
