"use client"

import { useFilteredData } from "./use-filtered-data"
import type { Project } from "@/lib/db/schema"

export function useProjects({
  completed,
  taskCompleted,
  taskDueDate,
  taskDeleted,
  projectTitle,
  limit,
}: {
  completed?: boolean
  taskCompleted?: boolean
  taskDueDate?: Date
  taskDeleted?: boolean
  projectTitle?: string
  limit?: number
}) {
  const { data, isLoading, isError, mutate } = useFilteredData<Project[]>({
    endpoint: "/api/project",
    params: {
      completed,
      taskCompleted,
      taskDueDate: taskDueDate ? taskDueDate.toISOString() : undefined,
      taskDeleted,
      projectTitle,
      limit: limit ? limit + 1 : undefined,
    },
  })

  return {
    projects: (data as Project[]) || [],
    isLoading,
    isError,
    mutate,
  }
}
