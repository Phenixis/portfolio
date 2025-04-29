"use client"

import type { Task, TaskWithRelations } from "@/lib/db/schema"
import { useFilteredData } from "./use-filtered-data"

// hooks/use-tasks.ts
export function useTasks({
  completed,
  orderBy,
  limit,
  orderingDirection,
  withProject,
  projectTitles,
  excludedProjectTitles,
  dueBefore,
  api_key, // NEW
}: {
  completed?: boolean
  orderBy?: keyof Task
  limit?: number
  orderingDirection?: "asc" | "desc"
  withProject?: boolean
  projectTitles?: string[]
  excludedProjectTitles?: string[]
  dueBefore?: Date
  api_key?: string // NEW
}) {
  const { data, isLoading, isError, mutate } = useFilteredData<Task[]>({
    endpoint: "/api/task",
    params: {
      completed,
      orderBy: orderBy as string,
      limit: limit ? limit + 1 : undefined,
      orderingDirection,
      withProject: withProject ? "true" : "false",
      projectTitles: projectTitles?.join(","),
      excludedProjectTitles: excludedProjectTitles?.join(","),
      dueBefore: dueBefore ? dueBefore.toISOString() : undefined,
    },
    api_key, // inject here
  })

  return {
    tasks: (data as TaskWithRelations[]) || [],
    isLoading,
    isError,
    mutate,
  }
}
