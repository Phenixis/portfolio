"use client"

import { Note, user } from "@/lib/db/schema"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { useState, useEffect } from "react"
import { ChevronDown, ChevronUp, ClipboardPlus, ClipboardCheck, Trash } from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton"
import NoteModal from "./note-modal"
import { toast } from "sonner"
import { useSWRConfig } from "swr"
import { useUser } from "@/hooks/use-user"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"


export default function NoteDisplay({ note }: { note?: Note }) {
    const user = useUser().user
    const { mutate } = useSWRConfig()

    const [isOpen, setIsOpen] = useState(false)
    const [isCopied, setIsCopied] = useState(false)
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
    const [isDeleting, setIsDeleting] = useState(false)

    const handleDelete = (e?: React.MouseEvent) => {
        if (e) e.stopPropagation()

        if (!note) return

        if (!isDeleteDialogOpen) {
            setIsDeleteDialogOpen(true)
            return
        }

        setIsDeleteDialogOpen(false)

        try {
            setIsDeleting(true)

            mutate(
                (key: unknown) => typeof key === "string" && key.startsWith("/api/note"),
                async (currentData: unknown): Promise<unknown> => {
                    if (!Array.isArray(currentData)) return currentData

                    return currentData.filter((item: Note) => item.id !== note.id)
                },
                { revalidate: false }
            )

            toast.success(`"${note.title}" deleted successfully`)

            fetch(`/api/note`, {
                method: "DELETE",
                headers: { "Content-Type": "application/json", "Authorization": `Bearer ${user?.api_key}` },
                body: JSON.stringify({ id: note.id })
            })

            mutate((key) => typeof key === "string" && key.startsWith("/api/note"))
        } catch (error) {
            console.error("Error deleting note:", error)
            toast.error("Error deleting note. See console for more details.")

            mutate((key) => typeof key === "string" && key.startsWith("/api/note"))
        } finally {
            setIsDeleting(false)
        }
    }

    return (
        <>
            <Card className="h-fit group/Note">
                <CardHeader className={`flex flex-row justify-between items-center space-y-0 px-2 pt-2 pb-2 md:px-4 md:pt-2 md:pb-2 xl:px-6 xl:pt-2`}>
                    {
                        note ? (
                            <CardTitle className={`w-full ${note && "cursor-pointer"}`} onClick={() => setIsOpen(note ? !isOpen : false)}>
                                {note.title}
                            </CardTitle>
                        ) : (
                            <Skeleton className="h-8 w-full" />
                        )
                    }
                    <div className={`flex flex-row items-center duration-200 ${isOpen ? "opacity-100" : "opacity-0"} ${note && "group-hover/Note:opacity-100 cursor-pointer"}`}>
                        {
                            note && isOpen ? (
                                <ChevronUp className={`w-4 h-4`} onClick={() => setIsOpen(note ? !isOpen : false)} />
                            ) : (
                                <ChevronDown className={`w-4 h-4`} onClick={() => setIsOpen(note ? !isOpen : false)} />
                            )
                        }
                    </div>
                </CardHeader>
                {
                    note && isOpen && (
                        <>
                            <CardContent className="xl:pb-2">
                                <p>{note.content}</p>
                            </CardContent>
                            <CardFooter className="flex flex-row justify-end space-x-2">
                                <Trash className="w-4 h-4 cursor-pointer text-red-500" onClick={handleDelete} />
                                {
                                    isCopied ? (
                                        <ClipboardCheck className="w-4 h-4 cursor-pointer" />
                                    ) : (
                                        <ClipboardPlus className="w-4 h-4 cursor-pointer" onClick={() => {
                                            navigator.clipboard.writeText(note.content)
                                            setIsCopied(true)
                                            toast.success("Copied to clipboard")
                                            setTimeout(() => {
                                                setIsCopied(false)
                                            }, 2000)
                                        }} />
                                    )
                                }
                                {
                                    <NoteModal note={note} />
                                }
                            </CardFooter>
                        </>
                    )
                }
            </Card>
            <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Delete Note</DialogTitle>
                        <DialogDescription>
                            Are you sure you want to delete this note?<br /><br />You will be able to find it back in your Trash (Settings &gt; Trash &gt; Notes).
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
                            Cancel
                        </Button>
                        
                        <Button variant="destructive" onClick={handleDelete}>
                            Delete
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    )
}