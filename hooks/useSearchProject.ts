"use client"

import type { Project } from "@/lib/db/schema"
import { useFilteredData } from "./useFilteredData"

export function useSearchProject({
  query,
  limit,
}: {
  query?: string
  limit?: number
}) {
  const { data, isLoading, isError, mutate } = useFilteredData<Project[]>({
    endpoint: "/api/project/search",
    params: {
      query,
      limit,
    },
  })

  return {
    projects: data as Project[],
    isLoading,
    isError,
    mutate,
  }
}