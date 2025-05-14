"use client"

import type { Task, TaskWithRelations } from "@/lib/db/schema"
import { useFilteredData } from "./use-filtered-data"
import { TaskCount } from "@/components/ui/calendar"

// hooks/use--number-of-tasks.ts
export function useNumberOfTasks({
    completed,
    projectTitles,
    excludedProjectTitles,
    dueAfter,
    dueBefore,
    enabled = true
}: {
    completed?: boolean
    projectTitles?: string[]
    excludedProjectTitles?: string[]
    dueAfter?: Date
    dueBefore?: Date
    enabled?: boolean
}) {
    const { data, isLoading, isError, mutate } = useFilteredData<Task[]>({
        endpoint: "/api/task/count",
        params: {
            completed,
            projectTitles: projectTitles?.join(","),
            excludedProjectTitles: excludedProjectTitles?.join(","),
            dueAfter: dueAfter ? dueAfter.toISOString() : undefined,
            dueBefore: dueBefore ? dueBefore.toISOString() : undefined,
        },
        skipFetch: !enabled,
    })

    return {
        data: (data as TaskCount[]) || [],
        isLoading,
        isError,
        mutate,
    }
}
