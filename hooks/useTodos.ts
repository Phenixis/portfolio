"use client"

import type { Todo, Project } from "@/lib/db/schema"
import { useFilteredData } from "./useFilteredData"

export function useTodos({
  completed,
  orderBy,
  limit,
  orderingDirection,
  withProject
}: {
  completed?: boolean
  orderBy?: keyof Todo
  limit?: number
  orderingDirection?: "asc" | "desc"
  withProject?: boolean
}) {
  const { data, isLoading, isError, mutate } = useFilteredData<Todo[]>({
    endpoint: "/api/todo",
    params: {
      completed,
      orderBy: orderBy as string,
      limit,
      orderingDirection,
      withProject: withProject ? "true" : "false",
    },
  })

  return {
    todos: data as (Todo | (Todo & { project: Project }))[],
    isLoading,
    isError,
    mutate,
  }
}

