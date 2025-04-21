"use client"

import { useFilteredData } from "./use-filtered-data"
import type { Project } from "@/lib/db/schema"

export function useProjects({
  completed,
}: {
  completed?: boolean
}) {
  const { data, isLoading, isError, mutate } = useFilteredData<Project[]>({
    endpoint: "/api/project",
    params: {
      completed,
    },
  })

  return {
    projects: (data as Project[]) || [],
    isLoading,
    isError,
    mutate,
  }
}
