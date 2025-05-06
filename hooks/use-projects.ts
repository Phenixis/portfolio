"use client"

import { useFilteredData } from "./use-filtered-data"
import type { Project } from "@/lib/db/schema"
import type { Note } from "@/lib/db/schema"

export function useProjects({
  completed,
  taskCompleted,
  taskDueDate,
  taskDeleted,
  projectTitle,
  limit,
  withNotes,
  noteLimit,
  noteOrderBy,
  noteOrderingDirection,
  noteProjectTitle,
}: {
  completed?: boolean
  taskCompleted?: boolean
  taskDueDate?: Date
  taskDeleted?: boolean
  projectTitle?: string
  limit?: number
  withNotes?: boolean
  noteLimit?: number
  noteOrderBy?: keyof Note
  noteOrderingDirection?: "asc" | "desc"
  noteProjectTitle?: string
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
      withNotes,
      noteLimit,
      noteOrderBy,
      noteOrderingDirection,
      noteProjectTitle,
    },
  })

  return {
    projects: (data as Project[]) || [],
    isLoading,
    isError,
    mutate,
  }
}
