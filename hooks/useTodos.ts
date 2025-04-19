"use client"

import type { Todo, Project, Duration, Importance } from "@/lib/db/schema"
import { useFilteredData } from "./useFilteredData"

export function useTodos({
  completed,
  orderBy,
  limit,
  orderingDirection,
  withProject,
  projectTitles,
  dueBefore,
}: {
  completed?: boolean
  orderBy?: keyof Todo
  limit?: number
  orderingDirection?: "asc" | "desc"
  withProject?: boolean
  projectTitles?: string[]
  dueBefore?: Date
}) {
  const { data, isLoading, isError, mutate } = useFilteredData<Todo[]>({
    endpoint: "/api/todo",
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
    todos:
      (data as (Todo & { project: Project | null; importanceDetails: Importance; durationDetails: Duration })[]) || [],
    isLoading,
    isError,
    mutate,
  }
}
