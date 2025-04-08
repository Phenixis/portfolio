"use client"

import type { Todo, Project } from "@/lib/db/schema"
import { useFilteredData } from "./useFilteredData"

export function useTodos({
  completed,
  orderBy,
  limit,
  orderingDirection,
  withProject,
  projectTitles
}: {
  completed?: boolean
  orderBy?: keyof Todo
  limit?: number
  orderingDirection?: "asc" | "desc"
  withProject?: boolean
  projectTitles?: string[]
}) {
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
    todos: data as (Todo | (Todo & { project: Project }))[],
    isLoading,
    isError,
    mutate,
  }
}

