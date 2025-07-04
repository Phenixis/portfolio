"use client"

import type { Project } from "@/lib/db/schema"
import { useFilteredData } from "./use-filtered-data"

interface UseSearchProjectParams {
  query?: string
  limit?: number
  enabled?: boolean
}

export function useSearchProject(params: UseSearchProjectParams = {}) {
  const { query, limit, enabled = true } = params

  // Only create a SWR key if query has a value
  const shouldFetch = (query !== undefined && query !== "") && enabled

  const { data, isLoading, isError, mutate } = useFilteredData<Project[]>({
    endpoint: "/api/project/search",
    params: {
      query,
      limit,
    },
    // Skip fetching if query is empty
    skipFetch: !shouldFetch,
  })

  return {
    data: (data as Project[]) || [],
    isLoading,
    isError,
    mutate,
    projects: (data as Project[]) || [], // Keep backward compatibility
  }
}
