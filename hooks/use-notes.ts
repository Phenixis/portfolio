"use client"

import { Note } from "@/lib/db/schema"
import { useFilteredData } from "./use-filtered-data"

export function useNotes({
    title,
    projectTitle,
    limit,
}: {
    title?: string
    projectTitle?: string
    limit?: number
}) {
    const { data, isLoading, isError, mutate } = useFilteredData<Note[]>({
        endpoint: "/api/note",
        params: {
            title,
            projectTitle,
            limit,
        },
    })

    return {
        data,
        isLoading,
        isError,
        mutate,
    }
}