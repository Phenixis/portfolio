"use client"

import NoteDisplay from "@/components/big/notes/note-display"
import { useNotes } from "@/hooks/use-notes"
import { Note } from "@/lib/db/schema"
import { useRouter, useSearchParams } from "next/navigation"
import { useState, useCallback, useTransition, useMemo, useEffect } from "react"
import {
    Pagination,
    PaginationContent,
    PaginationEllipsis,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from "@/components/ui/pagination"
import { Input } from "@/components/ui/input"
import { useDebouncedCallback } from "use-debounce"
import { Label } from "@/components/ui/label"
import SearchProjectsInput from "@/components/big/projects/search-projects-input"

export default function NotesPage() {
    const router = useRouter()
    const searchParams = useSearchParams()

    const [title, setTitle] = useState<string>(searchParams.get("title") || "")
    const [titleInputValue, setTitleInputValue] = useState<string>(title)
    const [projectTitle, setProjectTitle] = useState<string>(searchParams.get("project_title") || "")
    const [limit, setLimit] = useState<number>(searchParams.get("limit") ? Number.parseInt(searchParams.get("limit") as string) : 25)
    const [page, setPage] = useState<number>(searchParams.get("page") ? Number.parseInt(searchParams.get("page") as string) : 1)

    const debouncedSetTitle = useDebouncedCallback((value: string) => {
        setTitle(value)
        if (title !== "") {
            const params = new URLSearchParams(searchParams.toString())
            params.set('title', value)
            router.push(`?${params.toString()}`)
        } else {
            const params = new URLSearchParams(searchParams.toString())
            params.delete('title')
            router.push(`?${params.toString()}`)
        }
    }, 200)
    
    useEffect(() => {
        setTitleInputValue(title)
    }, [title])

    useEffect(() => {
        debouncedSetTitle(titleInputValue)
    }, [titleInputValue])

    const { data: notesData, isLoading, isError, mutate } = useNotes({
        title,
        projectTitle,
        limit,
        page
    })

    const handlePageChange = useCallback((newPage: number) => {
        setPage(newPage)
        const params = new URLSearchParams(searchParams.toString())
        params.set('page', newPage.toString())
        router.push(`?${params.toString()}`)
    }, [router, searchParams])

    return (
        <div className="flex flex-col gap-4">
            <div className="bg-background border-b">
                <div className="w-full px-2 py-1 flex flex-col lg:flex-row gap-2">
                    <div className="w-full lg:w-fit">
                        <Label className="text-nowrap">Search notes by title</Label>
                        <Input
                            value={titleInputValue}
                            onChange={(e) => setTitleInputValue(e.target.value)}
                        />
                    </div>
                    <SearchProjectsInput
                        project={projectTitle}
                        setProject={setProjectTitle}
                        defaultValue={projectTitle}
                        className="w-full lg:w-fit"
                    />
                    <Pagination>
                        <PaginationContent>
                            <PaginationItem>
                                <PaginationPrevious
                                    onClick={() => handlePageChange(Math.max(1, page - 1))}
                                    className={page <= 1 ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                                />
                            </PaginationItem>
                            <PaginationItem>
                                <PaginationLink
                                    onClick={() => handlePageChange(1)}
                                    isActive={page === 1}
                                >
                                    1
                                </PaginationLink>
                            </PaginationItem>
                            {page > 1 && (
                                <>
                                    <PaginationItem>
                                        <PaginationEllipsis />
                                    </PaginationItem>
                                    <PaginationItem>
                                        <PaginationLink isActive>{page}</PaginationLink>
                                    </PaginationItem>
                                </>
                            )}
                            {page < (notesData?.totalPages || 1) && (
                                <>
                                    <PaginationItem>
                                        <PaginationEllipsis />
                                    </PaginationItem>
                                    <PaginationItem>
                                        <PaginationLink
                                            onClick={() => handlePageChange(notesData?.totalPages || 1)}
                                            isActive={page === (notesData?.totalPages || 1)}
                                        >
                                            {notesData?.totalPages || 1}
                                        </PaginationLink>
                                    </PaginationItem>
                                </>
                            )}
                            <PaginationItem>
                                <PaginationNext
                                    onClick={() => handlePageChange(Math.min(notesData?.totalPages || 1, page + 1))}
                                    className={page >= (notesData?.totalPages || 1) ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                                />
                            </PaginationItem>
                        </PaginationContent>
                    </Pagination>
                </div>
            </div>
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
                    ) : notesData && notesData.notes && notesData.notes.length > 0 ? (
                        notesData.notes.map((note: Note) => (
                            <NoteDisplay key={note.id} note={note} />
                        ))
                    ) : (
                        <div>
                            <p>No notes found</p>
                        </div>
                    )
                }
            </div>
        </div>
    )
}