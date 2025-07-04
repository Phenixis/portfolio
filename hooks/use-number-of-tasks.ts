"use client"

import type { Task, TaskWithRelations } from "@/lib/db/schema"
import { useFilteredData } from "./use-filtered-data"
import { TaskCount } from "@/components/ui/calendar"

interface UseNumberOfTasksParams {
    projectTitles?: string[]
    excludedProjectTitles?: string[]
    dueAfter?: Date
    dueBefore?: Date
    enabled?: boolean
}

// hooks/use-number-of-tasks.ts
export function useNumberOfTasks(params: UseNumberOfTasksParams = {}) {
    const {
        projectTitles,
        excludedProjectTitles,
        dueAfter,
        dueBefore,
        enabled = true
    } = params

    const { data, isLoading, isError, mutate } = useFilteredData<Task[]>({
        endpoint: "/api/task/count",
        params: {
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
        taskCounts: (data as TaskCount[]) || [], // Keep backward compatibility
    }
}
