"use client"

import NoteDisplay from "@/components/big/notes/note-display"
import { useNotes } from "@/hooks/use-notes"
import { Note } from "@/lib/db/schema"
import { useRouter, useSearchParams } from "next/navigation"
import { useState, useCallback, useTransition, useMemo, useEffect } from "react"

export default function NotesPage() {
    const router = useRouter()
    const searchParams = useSearchParams()

    const [title, setTitle] = useState<string | undefined>(searchParams.get("title") || undefined)
    const [projectTitle, setProjectTitle] = useState<string | undefined>(searchParams.get("project_title") || undefined)
    const [limit, setLimit] = useState<number | undefined>(searchParams.get("limit") ? Number.parseInt(searchParams.get("limit") as string) : undefined)


    const { data: notes, isLoading, isError, mutate } = useNotes({
        title,
        projectTitle,
        limit,
    })


    return (
        <div className="p-4 grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {
                isLoading ? (
                    <>
                        {Array.from({ length: 10 }).map((_, index) => (
                            <NoteDisplay key={index} />
                        ))}
                    </>
                ) : isError ? (
                    <div>
                        <p>Error</p>
                    </div>
                ) : notes.length > 0 ? (
                    notes.map((note: Note) => (
                        <NoteDisplay key={note.id} note={note} />
                    ))
                ) : (
                    <div>
                        <p>No notes found</p>
                    </div>
                )
            }
        </div>
    )
}