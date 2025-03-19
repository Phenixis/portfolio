"use client"

import type React from "react"

import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import type { Todo } from "@/lib/db/schema"
import { PlusIcon, PenIcon, Minus, Plus } from "lucide-react"
import { useRef, useState, useEffect } from "react"
import { useSWRConfig } from "swr"
import { Calendar } from "@/components/ui/calendar"
import { calculateUrgency } from "@/lib/utils"
import { fr } from "date-fns/locale"
import { format } from "date-fns"

export function TodoModal({ className, todo }: { className?: string; todo?: Todo }) {
    const mode = todo ? "edit" : "create"
    const [open, setOpen] = useState(false)
    const [dueDate, setDueDate] = useState<Date>(todo ? new Date(todo.due) : new Date())
    const [showCalendar, setShowCalendar] = useState(false)
    const calendarRef = useRef<HTMLDivElement>(null)
    const { mutate } = useSWRConfig()

    // Utiliser des refs pour accéder aux valeurs des champs
    const titleRef = useRef<HTMLInputElement>(null)
    const importanceRef = useRef<HTMLInputElement>(null)
    const durationRef = useRef<HTMLInputElement>(null)

    // État pour suivre si une soumission est en cours (pour éviter les doubles soumissions)
    const isSubmittingRef = useRef(false)

    // Close calendar when clicking outside
    useEffect(() => {
        if (!showCalendar) return

        const handleClickOutside = (event: MouseEvent) => {
            if (calendarRef.current && !calendarRef.current.contains(event.target as Node)) {
                setShowCalendar(false)
            }
        }

        document.addEventListener("mousedown", handleClickOutside)
        return () => {
            document.removeEventListener("mousedown", handleClickOutside)
        }
    }, [showCalendar])

    // Fonction optimisée pour gérer la soumission
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        // Éviter les doubles soumissions
        if (isSubmittingRef.current) return
        isSubmittingRef.current = true

        try {
            // Extraire les valeurs directement des refs
            const title = titleRef.current?.value || ""
            const importance = Number.parseInt(importanceRef.current?.value || "0")
            const duration = Number.parseInt(durationRef.current?.value || "0")
            const id = todo?.id

            // Validation rapide
            if (!title.trim()) {
                isSubmittingRef.current = false
                return
            }

            // Créer l'objet todo pour la mise à jour optimiste
            const urgency = calculateUrgency(dueDate)
            const score = importance * urgency - duration
            const todoData = {
                id: mode === "edit" ? id : -1, // ID temporaire pour création
                title,
                importance,
                urgency,
                duration,
                score,
                due: dueDate,
                created_at: mode === "create" ? new Date() : todo?.created_at,
                updated_at: new Date(),
                deleted_at: todo?.deleted_at || null,
                completed_at: todo?.completed_at || null,
            } as Todo

            // Fermer immédiatement le modal pour une expérience instantanée
            setOpen(false)

            // Mise à jour optimiste du cache SWR
            mutate(
                (key) => typeof key === "string" && key.startsWith("/api/todos"),
                async (currentData) => {
                    if (!Array.isArray(currentData)) return currentData

                    let updatedData
                    if (mode === "edit") {
                        updatedData = currentData.map((item) => (item.id === id ? todoData : item))
                    } else {
                        updatedData = [todoData, ...currentData]
                    }

                    // Order the data based on the score of the item
                    return updatedData.sort((a, b) => b.score - a.score)
                },
                { revalidate: false },
            )

            // Effectuer l'appel API en arrière-plan
            fetch("/api/todos", {
                method: mode === "edit" ? "PUT" : "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    id: mode === "edit" ? id : undefined,
                    title,
                    importance,
                    dueDate: dueDate.toISOString(),
                    duration,
                }),
            })
                .then((response) => {
                    if (!response.ok) {
                        throw new Error(`Erreur HTTP: ${response.status}`)
                    }
                    return response.json()
                })
                .then(() => {
                    // Revalider silencieusement après la réponse API
                    mutate((key) => typeof key === "string" && key.startsWith("/api/todos"))
                })
                .catch((error) => {
                    console.error("Erreur lors de l'opération:", error)

                    // Revalider pour restaurer l'état correct
                    mutate((key) => typeof key === "string" && key.startsWith("/api/todos"))
                })

            setDueDate(new Date())
        } catch (error) {
            console.error("Erreur lors de la soumission:", error)
            isSubmittingRef.current = false
        }
    }

    // Gestionnaire de raccourci clavier pour soumettre avec Ctrl+Enter
    useEffect(() => {
        const handleKeyPress = (event: KeyboardEvent) => {
            if (event.ctrlKey && event.key === "Enter" && open) {
                const form = document.getElementById("todo-form") as HTMLFormElement
                if (form) {
                    form.requestSubmit()
                }
            }
        }

        document.addEventListener("keydown", handleKeyPress)
        return () => {
            document.removeEventListener("keydown", handleKeyPress)
        }
    }, [open])

    // Réinitialiser l'état de soumission quand le modal s'ouvre/se ferme
    useEffect(() => {
        isSubmittingRef.current = false
    }, [open])

    const handleDateChange = (date: Date | undefined) => {
        if (date) {
            setDueDate(date)
            setShowCalendar(false)
        }
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger className={className}>
                {mode === "edit" ? <PenIcon className="size-4" /> : <PlusIcon className="size-6" />}
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>{mode === "edit" ? "Modifier Todo" : "Créer Todo"}</DialogTitle>
                </DialogHeader>
                <form id="todo-form" onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <Label htmlFor="title">Titre</Label>
                        <Input ref={titleRef} type="text" id="title" name="title" defaultValue={todo?.title || ""} autoFocus />
                    </div>
                    <div className="flex space-x-4">
                        <div>
                            <Label htmlFor="importance">Importance</Label>
                            <Input
                                ref={importanceRef}
                                type="number"
                                id="importance"
                                name="importance"
                                defaultValue={todo?.importance || 0}
                                min={0}
                                max={5}
                            />
                        </div>
                        <div className="relative">
                            <Label htmlFor="dueDate">Due date</Label>
                            <div className="flex gap-1">
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => {
                                        const newDate = new Date(dueDate.getTime() - 24 * 60 * 60 * 1000)
                                        const today = new Date()
                                        today.setHours(0, 0, 0, 0)
                                        if (newDate >= today) {
                                            setDueDate(newDate)
                                        }
                                    }}
                                >
                                    <Minus />
                                </Button>
                                <Button type="button" variant="outline" onClick={() => setShowCalendar(!showCalendar)}>
                                    {format(dueDate, "dd/MM/yyyy")}
                                </Button>
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => {
                                        setDueDate(new Date(dueDate.getTime() + 24 * 60 * 60 * 1000))
                                    }}
                                >
                                    <Plus />
                                </Button>
                            </div>

                            {showCalendar && (
                                <div
                                    ref={calendarRef}
                                    className="absolute z-50 mt-1 bg-popover p-3 rounded-md shadow-md border border-border"
                                >
                                    <Calendar
                                        mode="single"
                                        selected={dueDate}
                                        onSelect={handleDateChange}
                                        disabled={(date) => {
                                            const today = new Date()
                                            today.setHours(0, 0, 0, 0)
                                            return date < today
                                        }}
                                        locale={fr}
                                    />
                                </div>
                            )}
                        </div>
                        <div>
                            <Label htmlFor="duration">Durée</Label>
                            <Input
                                ref={durationRef}
                                type="number"
                                id="duration"
                                name="duration"
                                defaultValue={todo?.duration || 0}
                                min={0}
                                max={3}
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button type="submit">{mode === "edit" ? "Enregistrer" : "Créer"}</Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}

