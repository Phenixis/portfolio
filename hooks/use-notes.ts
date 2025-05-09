"use client"

import { Note } from "@/lib/db/schema"
import { useFilteredData } from "./use-filtered-data"
import { NotesAndData } from "@/lib/db/queries/note"

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
    const { data, isLoading, isError, mutate } = useFilteredData<NotesAndData>({
        endpoint: "/api/note",
        params: {
            title,
            projectTitle,
            limit: limit ? limit + 1 : undefined,
            page,
            projectTitles: projectTitles?.join(","),
            excludedProjectTitles: excludedProjectTitles?.join(",")
        },
    })

    return {
        data: data as NotesAndData,
        isLoading,
        isError,
        mutate,
    }
}