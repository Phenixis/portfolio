"use client"

import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Plus, PenIcon } from "lucide-react"
import { useUser } from "@/hooks/use-user"
import { Note } from "@/lib/db/schema"
import { useState, useRef, useEffect } from "react"
import { cn } from "@/lib/utils"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useSWRConfig } from "swr"
import { toast } from "sonner"

export default function NoteModal({
    className,
    note,
}: {
    className?: string
    note?: Note
}) {
    const user = useUser().user;
    const mode = note ? "edit" : "create"
	const { mutate } = useSWRConfig()

    // State
    const [open, setOpen] = useState(false)
    const [formChanged, setFormChanged] = useState(false)

    // Refs
    const titleRef = useRef<HTMLInputElement>(null)
    const contentRef = useRef<HTMLTextAreaElement>(null)
    const isSubmittingRef = useRef(false)
    // Handlers
    const resetForm = () => {
        titleRef.current!.value = ""
        contentRef.current!.value = ""
        setFormChanged(false)
    }

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        
        if (isSubmittingRef.current) return
        isSubmittingRef.current = true

        try {
            const title = titleRef.current?.value || ""
            const content = contentRef.current?.value || ""

            if (!title.trim()) {
                isSubmittingRef.current = false
                return
            }

            const noteData = {
                id: mode === "edit" ? note?.id : -1,
                user_id: user?.id,
                title,
                content,
                created_at: mode === "create" ? new Date() : note?.created_at,
                updated_at: new Date(),
            } as Note

            setOpen(false)

            mutate(
                (key: unknown) => typeof key === "string" && key.startsWith("/api/note"),
                async (currentData: unknown): Promise<Note[] | unknown> => {
                    if (!Array.isArray(currentData)) return currentData

                    let updatedData: Note[]
                    if (mode === "edit") {
                        updatedData = currentData.map((item: Note) => (item.id === note?.id ? noteData : item))
                    } else {
                        updatedData = [...currentData, noteData]
                    }

                    return updatedData
                },
                { revalidate: false },
            )

            toast.success("Note saved successfully")
            
            fetch("/api/note", {
                method: mode === "edit" ? "PUT" : "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${user?.api_key}`
                },
                body: JSON.stringify(noteData),
            })
                .then((response) => {
                    if (!response.ok) {
                        throw new Error(`Erreur HTTP: ${response.status}`)
                    }
                    return response.json()
                })
                .then(() => {
                    mutate((key) => typeof key === "string" && key.startsWith("/api/note"))
                })
                .catch((error) => {
                    console.error("Erreur lors de l'opération:", error)
                    mutate((key) => typeof key === "string" && key.startsWith("/api/note"))
                })
            
            resetForm()
            isSubmittingRef.current = false
        } catch (error) {
            console.error("Erreur lors de la soumission:", error)
            isSubmittingRef.current = false
        }
    }
    const verifyFormChanged = () => {
        setFormChanged(
            (mode === "edit" ? 
                titleRef.current?.value.trim() !== note?.title.trim() : 
                titleRef.current?.value.trim() !== "")
            ||
            (mode === "edit" ? 
                contentRef.current?.value.trim() !== note?.content.trim() :
                contentRef.current?.value.trim() !== "")
        )
    }

    // Effects
    

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                {
                    mode === "create" ? (
                        <Button variant="outline" size="icon" className={cn("lg:ml-2 xl:ml-4 whitespace-nowrap transition-transform duration-300", className)}>
                            <Plus size={24} />
                        </Button>
                    ) : (
                        <PenIcon className={cn("min-w-[16px] max-w-[16px] min-h-[24px] max-h-[24px] cursor-pointer", className)} />
                    )
                }
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>
                        {mode === "create" ? "Create Note" : "Edit Note"}
                    </DialogTitle>
                </DialogHeader>
                <form id="note-form" onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <Label htmlFor="title" required>Title</Label>
                        <Input
                            ref={titleRef}
                            type="text"
                            id="title"
                            name="title"
                            defaultValue={note?.title || ""}
                            autoFocus
                            onChange={() => verifyFormChanged()}
                        />
                    </div>
                    <div>
                        <Label htmlFor="content" required>Content</Label>
                        <Textarea
                            ref={contentRef}
                            id="content"
                            name="content"
                            defaultValue={note?.content || ""}
                            onChange={() => verifyFormChanged()}
                        />
                    </div>
                    <DialogFooter>
                        <Button type="submit" disabled={!formChanged}>
                            {mode === "create" ? "Create" : "Save"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}