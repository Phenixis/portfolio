"use client"

import type { Task } from "@/lib/db/schema"
import { useFilteredData } from "./use-filtered-data"

export function useSearchTasks({
  query,
  limit,
  excludeIds = [],
}: {
  query?: string
  limit?: number
  excludeIds?: number[]
}) {
  // Only create a SWR key if query has a value
  const shouldFetch = query !== undefined && query !== ""

  const { data, isLoading, isError, mutate } = useFilteredData<Task[]>({
    endpoint: "/api/task/search",
    params: {
      query,
      limit,
      excludeIds: excludeIds.length > 0 ? excludeIds.join(",") : undefined,
    },
    // Skip fetching if query is empty
    skipFetch: !shouldFetch,
  })

  // Filter out tasks with excluded IDs (in case server filtering fails)
  const filteredTasks = data ?
    (data as Task[]).filter(task => !excludeIds.includes(task.id)) :
    []

  return {
    tasks: filteredTasks,
    isLoading,
    isError,
    mutate,
  }
}
