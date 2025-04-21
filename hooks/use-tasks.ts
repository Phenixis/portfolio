"use client"

import type { Task, TaskWithRelations } from "@/lib/db/schema"
import { useFilteredData } from "./use-filtered-data"

export function useTasks({
  completed,
  orderBy,
  limit,
  orderingDirection,
  withProject,
  projectTitles,
  dueBefore,
}: {
  completed?: boolean
  orderBy?: keyof Task
  limit?: number
  orderingDirection?: "asc" | "desc"
  withProject?: boolean
  projectTitles?: string[]
  dueBefore?: Date
}) {
  const { data, isLoading, isError, mutate } = useFilteredData<Task[]>({
    endpoint: "/api/task",
    params: {
      completed,
      orderBy: orderBy as string,
      limit: limit ? limit+1 : undefined,
      orderingDirection,
      withProject: withProject ? "true" : "false",
      projectTitles: projectTitles?.join(","),
      dueBefore: dueBefore ? dueBefore.toISOString() : undefined,
    },
  })

  return {
    tasks:
      (data as TaskWithRelations[]) || [],
    isLoading,
    isError,
    mutate,
  }
}
