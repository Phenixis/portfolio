"use client"

import { useFilteredData } from "./use-filtered-data"
import type { Project } from "@/lib/db/schema"
import type { Note } from "@/lib/db/schema"

interface UseProjectsParams {
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
}

export function useProjects(params: UseProjectsParams = {}) {
  const {
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
  } = params

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
    data: (data as Project[]) || [],
    isLoading,
    isError,
    projects: (data as Project[]) || [], // Keep backward compatibility
    mutate,
  }
}
