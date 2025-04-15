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
}: {
  completed?: boolean
  orderBy?: keyof Todo
  limit?: number
  orderingDirection?: "asc" | "desc"
  withProject?: boolean
  projectTitles?: string[]
}) {
  // We don't need to skip fetching for this hook as all parameters are optional
  // and the API should handle undefined parameters gracefully
  const { data, isLoading, isError, mutate } = useFilteredData<Todo[]>({
    endpoint: "/api/todo",
    params: {
      completed,
      orderBy: orderBy as string,
      limit,
      orderingDirection,
      withProject: withProject ? "true" : "false",
      projectTitles: projectTitles?.join(","),
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
