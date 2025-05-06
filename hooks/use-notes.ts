"use client"

import { Note } from "@/lib/db/schema"
import { useFilteredData } from "./use-filtered-data"

export function useNotes({
    title,
    projectTitle,
    limit,
    page,
    projectTitles,
    excludedProjectTitles
}: {
    title?: string
    projectTitle?: string
    limit?: number
    page?: number
    projectTitles?: string[]
    excludedProjectTitles?: string[]
}) {
    const { data, isLoading, isError, mutate } = useFilteredData<Note[]>({
        endpoint: "/api/note",
        params: {
            title,
            projectTitle,
            limit,
            page,
            projectTitles: projectTitles?.join(","),
            excludedProjectTitles: excludedProjectTitles?.join(",")
        },
    })

    return {
        data,
        isLoading,
        isError,
        mutate,
    }
}