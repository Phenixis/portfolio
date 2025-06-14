"use client"

import { Note } from "@/lib/db/schema"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { useState } from "react"
import { ChevronDown, ChevronUp, ClipboardPlus, ClipboardCheck, Trash, Lock } from "lucide-react"
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
import { decryptNote } from "@/lib/utils/crypt"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { NotesAndData } from "@/lib/db/queries/note"
import { cn } from "@/lib/utils"

export default function NoteDisplay({ note, className }: { note?: Note, className?: string }) {
    const user = useUser().user
    const { mutate } = useSWRConfig()

    const [isOpen, setIsOpen] = useState(false)
    const [isCopied, setIsCopied] = useState(false)
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)

    const [decryptedContent, setDecryptedContent] = useState<string | null>(null)
    const [password, setPassword] = useState("")
    const [decryptError, setDecryptError] = useState(false)

    const handleDecrypt = () => {
        if (note && note.salt && note.iv && password && !decryptedContent) {
            decryptNote(note.content, password, note.salt, note.iv)
                .then(setDecryptedContent)
                .catch((e: unknown) => {
                    setDecryptError(true)
                    console.log(e)
                    toast.error("Decryption failed. Wrong password or corrupted data.")
                })
        }
    }

    const cancelDecrypt = () => {
        setDecryptedContent(null)
        setPassword("")
        setDecryptError(false)
    }

    const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            handleDecrypt()
        }
    }

    const handleDelete = (e?: React.MouseEvent) => {
        if (e) e.stopPropagation()

        if (!note) return

        if (!isDeleteDialogOpen) {
            setIsDeleteDialogOpen(true)
            return
        }

        setIsDeleteDialogOpen(false)

        try {

            mutate(
                (key: unknown) => typeof key === "string" && (key === "/api/note" || key.startsWith("/api/note?")),
                async (currentData: unknown): Promise<unknown> => {
                    try {
                        const data = currentData as NotesAndData
                        if (!data) return currentData
                        const currentNotes = data.notes || []

                        return {
                            ...data,
                            notes: currentNotes.filter((n: Note) => n.id !== note.id),
                            totalCount: data.totalCount - 1,
                            totalPages: Math.ceil((data.totalCount - 1) / data.limit),
                        }
                    } catch (error: unknown) {
                        console.error("Error updating notes data:", error)
                        return currentData
                    }
                },
                { revalidate: false }
            )

            toast.success(`"${note.title}" deleted successfully`)

            fetch(`/api/note`, {
                method: "DELETE",
                headers: { "Content-Type": "application/json", "Authorization": `Bearer ${user?.api_key}` },
                body: JSON.stringify({ id: note.id })
            })

            mutate((key) => typeof key === "string" && (key === "/api/note" || key.startsWith("/api/note?")))
        } catch (error) {
            console.error("Error deleting note:", error)
            toast.error("Error deleting note. Try again later.")
            mutate((key) => typeof key === "string" && (key === "/api/note" || key.startsWith("/api/note?")))
        }
    }

    return (
        <>
            <Card className={cn(`h-fit group/Note`, className)}>
                <CardHeader className={`flex flex-row justify-between items-center space-y-0 px-2 pt-2 pb-2 md:px-4 md:pt-2 md:pb-2 xl:px-2 xl:pt-2 ${note === undefined && "h-12 w-full bg-accent animate-pulse rounded-md"}`}>
                    {
                        note && (
                            <div className="w-full" onClick={() => {
                                setIsOpen(note ? !isOpen : false)
                                if (note.salt && note.iv && decryptedContent && !isOpen) {
                                    cancelDecrypt()
                                }
                            }}>
                                <CardTitle className={`w-full text-sm lg:text-base xl:text-base ${note && "cursor-pointer"} flex flex-row items-center gap-1`}>
                                    {
                                        note.salt && note.iv ? (
                                            <Lock className="size-3 cursor-pointer"/>
                                        ) : null
                                    }
                                    {note.title}
                                </CardTitle>
                                <p className="text-xs lg:text-sm text-gray-500">
                                    {note.project_title}
                                </p>
                            </div>
                        )
                    }
                    <div className={`${!note && "hidden"} flex flex-row items-center duration-200 ${isOpen ? "opacity-100" : "lg:opacity-0"} ${note && "lg:group-hover/Note:opacity-100 cursor-pointer"}`}>
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
                            <CardContent className="xl:pb-2 text-xs lg:text-sm break-words">
                                {
                                    note.salt && note.iv ? (
                                        !decryptedContent ? (
                                            <>
                                                <Label required>Enter the password to decrypt the note</Label>
                                                <Input
                                                    type="password"
                                                    placeholder="Enter password to decrypt"
                                                    value={password}
                                                    onChange={(e) => {
                                                        setPassword(e.target.value)
                                                        setDecryptError(false)
                                                    }}
                                                    onKeyDown={handleKeyPress}
                                                />
                                                {decryptError && <p className="text-red-500 text-sm">Incorrect password.</p>}
                                            </>
                                        ) : (
                                            <p >{decryptedContent}</p>
                                        )
                                    ) : (
                                        <p>{note.content}</p>
                                    )
                                }
                            </CardContent>
                            <CardFooter className="flex flex-row justify-end space-x-2">
                                {
                                    note.salt && note.iv && decryptedContent && (
                                        <Lock className="w-4 h-4 cursor-pointer" onClick={cancelDecrypt} />
                                    )
                                }
                                <Trash className="w-4 h-4 cursor-pointer text-red-500" onClick={handleDelete} />
                                {
                                    isCopied ? (
                                        <ClipboardCheck className="w-4 h-4 cursor-pointer" />
                                    ) : ((note.salt && note.iv && decryptedContent) || !(note.salt && note.iv)) && (
                                        <ClipboardPlus className="w-4 h-4 cursor-pointer" onClick={() => {
                                            navigator.clipboard.writeText(note.salt && note.iv && decryptedContent ? decryptedContent : note.content)
                                            setIsCopied(true)
                                            toast.success("Copied to clipboard")
                                            setTimeout(() => {
                                                setIsCopied(false)
                                            }, 2000)
                                        }} />
                                    )
                                }
                                {
                                    ((note.salt && note.iv && decryptedContent) || !(note.salt && note.iv)) && (
                                        <NoteModal note={note} password={password} />
                                    )
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