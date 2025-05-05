"use client"

import { Note, user } from "@/lib/db/schema"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { useState, useEffect } from "react"
import { ChevronDown, ChevronUp, ClipboardPlus, ClipboardCheck, Trash, Lock } from "lucide-react"
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
import { decryptNote } from "@/lib/utils/crypt"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useDebouncedCallback } from "use-debounce"

export default function NoteDisplay({ note }: { note?: Note }) {
    const user = useUser().user
    const { mutate } = useSWRConfig()

    const [isOpen, setIsOpen] = useState(false)
    const [isCopied, setIsCopied] = useState(false)
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
    const [isDeleting, setIsDeleting] = useState(false)

    const [decryptedContent, setDecryptedContent] = useState<string | null>(null)
    const [password, setPassword] = useState("")
    const [decryptError, setDecryptError] = useState(false)

    const debouncedDecrypt = useDebouncedCallback((pwd: string) => {
        if (note && note.salt && note.iv && pwd && !decryptedContent) {
            decryptNote(note.content, pwd, note.salt, note.iv)
                .then(setDecryptedContent)
                .catch((e: any) => {
                    setDecryptError(true)
                    toast.error("Decryption failed. Wrong password or corrupted data.")
                    console.log(e)
                })
        }
    }, 200)

    useEffect(() => {
        debouncedDecrypt(password)
    }, [password, note])

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
                            <CardTitle className={`w-full text-lg xl:text-lg ${note && "cursor-pointer"}`} onClick={() => setIsOpen(note ? !isOpen : false)}>
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
                                                />
                                                {decryptError && <p className="text-red-500 text-sm">Incorrect password.</p>}
                                            </>
                                        ) : (
                                            <p>{decryptedContent}</p>
                                        )
                                    ) : (
                                        <p>{note.content}</p>
                                    )
                                }
                            </CardContent>
                            <CardFooter className="flex flex-row justify-end space-x-2">
                                {
                                    note.salt && note.iv && decryptedContent && (
                                        <Lock className="w-4 h-4 cursor-pointer" onClick={() => {
                                            setDecryptedContent(null)
                                            setPassword("")
                                        }} />
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