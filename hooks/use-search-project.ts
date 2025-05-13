"use client"

import type { Project } from "@/lib/db/schema"
import { useFilteredData } from "./use-filtered-data"

export function useSearchProject({
  query,
  limit,
  enabled = true,
}: {
  query?: string
  limit?: number
  enabled?: boolean
}) {
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
    projects: (data as Project[]) || [],
    isLoading,
    isError,
    mutate,
  }
}
