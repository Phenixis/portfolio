"use client"

import type { Todo } from "@/lib/db/schema"
import { useFilteredData } from "./useFilteredData"

export function useTodos({
  completed,
  orderBy,
  limit,
  orderingDirection,
}: {
  completed?: boolean
  orderBy?: keyof Todo
  limit?: number
  orderingDirection?: "asc" | "desc"
}) {
  const { data, isLoading, isError, mutate } = useFilteredData<Todo[]>({
    endpoint: "/api/todos",
    params: {
      completed,
      orderBy: orderBy as string,
      limit,
      orderingDirection,
    },
  })

  return {
    todos: data,
    isLoading,
    isError,
    mutate,
  }
}

