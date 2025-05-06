"use client"

import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Plus, PenIcon, ChevronDown } from "lucide-react"
import { useUser } from "@/hooks/use-user"
import { Note } from "@/lib/db/schema"
import { useState, useRef, useEffect } from "react"
import { cn } from "@/lib/utils"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useSWRConfig } from "swr"
import { toast } from "sonner"
import { encryptNote, decryptNote } from "@/lib/utils/crypt"
import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from "@/components/ui/collapsible"
import { useDebouncedCallback } from "use-debounce"
import { useSearchProject } from "@/hooks/use-search-project"

export default function NoteModal({
    className,
    note,
    password,
}: {
    className?: string
    note?: Note
    password?: string
}) {
    const user = useUser().user;
    const mode = note ? "edit" : "create"
    const { mutate } = useSWRConfig()

    // State
    const [open, setOpen] = useState(false)
    const [formChanged, setFormChanged] = useState(false)
    const [showAdvancedOptions, setShowAdvancedOptions] = useState(false)
    const [decryptedContent, setDecryptedContent] = useState<string | null>(null)
    const [passwordValue, setPasswordValue] = useState<string>(password || "")

    const [project, setProject] = useState<string>(note && note.project_title ? note.project_title : "")
    const [projectInputValue, setProjectInputValue] = useState<string>(note && note.project_title ? note.project_title : "")
    const { projects, isLoading, isError } = useSearchProject({ query: project, limit: 5 })
    const [showProjectSuggestions, setShowProjectSuggestions] = useState(false)

    // Refs
    const titleRef = useRef<HTMLInputElement>(null)
    const contentRef = useRef<HTMLTextAreaElement>(null)
    const isSubmittingRef = useRef(false)

    // Handlers
    const resetForm = () => {
        titleRef.current!.value = ""
        contentRef.current!.value = ""
        setProject("")
        setProjectInputValue("")
        setFormChanged(false)
    }

    const handleProjectChange = useDebouncedCallback((value: string) => {
        setProject(value)
    }, 200)

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
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

            let noteData: Note

            // 🔐 Encrypt the note content
            if (passwordValue) {
                const encrypted = await encryptNote(content, passwordValue)

                noteData = {
                    id: mode === "edit" ? note?.id : -1,
                    user_id: user?.id,
                    title,
                    content: encrypted.ciphertext,
                    project_title: project,
                    salt: encrypted.salt,
                    iv: encrypted.iv,
                    created_at: mode === "create" ? new Date() : note?.created_at,
                    updated_at: new Date(),
                } as Note
            } else {
                noteData = {
                    id: mode === "edit" ? note?.id : -1,
                    user_id: user?.id,
                    title,
                    content,
                    project_title: project,
                    created_at: mode === "create" ? new Date() : note?.created_at,
                    updated_at: new Date(),
                } as Note
            }

            resetForm()
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

                    return updatedData.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
                },
                { revalidate: false },
            )

            toast.success(`Note ${mode === "edit" ? "updated" : "created"} successfully`)

            await fetch("/api/note", {
                method: mode === "edit" ? "PUT" : "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${user?.api_key}`
                },
                body: JSON.stringify(noteData),
            })

            mutate((key) => typeof key === "string" && key.startsWith("/api/note"))
            isSubmittingRef.current = false
        } catch (error) {
            toast.error(`Failed to ${mode === "edit" ? "update" : "create"} note. Try again later.`)
            console.error("Erreur lors de la soumission:", error)
            isSubmittingRef.current = false
        }
    }

    const verifyFormChanged = () => {
        setFormChanged(
            (mode === "edit" ?
                titleRef.current?.value.trim() !== note?.title.trim() :
                titleRef.current?.value.trim() !== ""
            )
            &&
            (mode === "edit" ?
                contentRef.current?.value.trim() !== note?.content.trim() :
                contentRef.current?.value.trim() !== ""
            )
        )
    }

    const debouncedDecrypt = useDebouncedCallback((pwd: string) => {
        if (mode === "edit" && note?.salt && note?.iv && pwd) {
            // Decrypt content when password is available and note exists
            decryptNote(note.content, pwd, note.salt, note.iv)
                .then((decryptedContent) => {
                    setDecryptedContent(decryptedContent)
                    if (contentRef.current) {
                        contentRef.current.value = decryptedContent
                    }
                })
                .catch((err) => {
                    console.error("Decryption failed", err)
                    toast.error("Failed to decrypt note content.")
                })
        }
    }, 200)

    // Decrypt content when dialog opens
    useEffect(() => {
        debouncedDecrypt(password || "")
    }, [password])

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
                            className="text-xs lg:text-base"
                            defaultValue={decryptedContent || note?.content || ""}
                            onChange={() => verifyFormChanged()}
                        />
                    </div>
                    <div className="w-full">
                        <Label htmlFor="project">Project</Label>
                        <Input
                            type="text"
                            id="project"
                            name="project"
                            value={projectInputValue}
                            onFocus={() => setShowProjectSuggestions(true)}
                            onBlur={(e) => {
                                // Delay hiding to allow click on suggestions
                                setTimeout(() => {
                                    if (!e.relatedTarget || !e.relatedTarget.closest(".project-suggestions")) {
                                        setShowProjectSuggestions(false)
                                    }
                                }, 100)
                            }}
                            onChange={(e) => {
                                setProjectInputValue(e.target.value)
                                handleProjectChange(e.target.value)
                                setFormChanged(
                                    (e.target.value !== note?.project_title && mode === "edit") || e.target.value !== ""
                                )
                            }}
                        />
                        {showProjectSuggestions && projectInputValue && (
                            <div
                                className="mt-1 overflow-y-auto rounded-md border border-border bg-popover shadow-md project-suggestions"
                                tabIndex={-1}
                            >
                                {isLoading ? (
                                    <div className="p-2 text-sm text-muted-foreground">Loading projects...</div>
                                ) : isError ? (
                                    <div className="p-2 text-sm text-destructive">Error loading projects</div>
                                ) : projects && projects.length > 0 ? (
                                    <ul className="">
                                        {projects.map((proj, index) => (
                                            <li
                                                key={index}
                                                className={`cursor-pointer px-3 py-2 text-sm lg:hover:bg-accent ${projectInputValue === proj.title ? "bg-primary/10" : ""}`}
                                                onMouseDown={(e) => e.preventDefault()} // Prevent blur on click
                                                onClick={() => {
                                                    const selectedProject = proj.title
                                                    setProjectInputValue(selectedProject)
                                                    setProject(selectedProject)
                                                    setShowProjectSuggestions(false)
                                                }}
                                            >
                                                {proj.title}
                                            </li>
                                        ))}
                                    </ul>
                                ) : (
                                    <div className="p-2 text-sm text-muted-foreground">No projects found</div>
                                )}
                            </div>
                        )}
                    </div>
                    <Collapsible className="w-full" open={showAdvancedOptions} onOpenChange={setShowAdvancedOptions}>
                        <CollapsibleTrigger className="flex text-sm font-medium text-muted-foreground mb-4">
                            Advanced Options
                            <ChevronDown className={`ml-2 h-4 w-4 duration-300 ${showAdvancedOptions && "rotate-180"}`} />
                        </CollapsibleTrigger>
                        <CollapsibleContent className="space-y-4">
                            <div>
                                <Label htmlFor="password">Password</Label>
                                <Input
                                    type="text"
                                    id="password"
                                    name="password"
                                    value={passwordValue}
                                    onChange={(e) => setPasswordValue(e.target.value)}
                                />
                            </div>
                        </CollapsibleContent>
                    </Collapsible>
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
