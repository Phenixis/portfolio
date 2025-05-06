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


export default function NotesPage() {
    const router = useRouter()
    const searchParams = useSearchParams()

    const [title, setTitle] = useState<string | undefined>(searchParams.get("title") || undefined)
    const [projectTitle, setProjectTitle] = useState<string | undefined>(searchParams.get("project_title") || undefined)
    const [limit, setLimit] = useState<number | undefined>(searchParams.get("limit") ? Number.parseInt(searchParams.get("limit") as string) : undefined)
    const [page, setPage] = useState<number>(searchParams.get("page") ? Number.parseInt(searchParams.get("page") as string) : 1)

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
                <div className="w-full py-1">
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