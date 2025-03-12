"use client"

import type React from "react"

import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import type { Todo } from "@/lib/db/schema"
import { PlusIcon, PenIcon } from "lucide-react"
import { useRef, useState, useEffect } from "react"
import { useSWRConfig } from "swr"

export function TodoModal({ className, todo }: { className?: string; todo?: Todo }) {
    const mode = todo ? "edit" : "create"
    const [open, setOpen] = useState(false)
    const { mutate } = useSWRConfig()

    // Utiliser des refs pour accéder aux valeurs des champs
    const titleRef = useRef<HTMLInputElement>(null)
    const importanceRef = useRef<HTMLInputElement>(null)
    const urgencyRef = useRef<HTMLInputElement>(null)
    const durationRef = useRef<HTMLInputElement>(null)

    // État pour suivre si une soumission est en cours (pour éviter les doubles soumissions)
    const isSubmittingRef = useRef(false)

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
            const urgency = Number.parseInt(urgencyRef.current?.value || "0")
            const duration = Number.parseInt(durationRef.current?.value || "0")
            const id = todo?.id

            // Validation rapide
            if (!title.trim()) {
                isSubmittingRef.current = false
                return
            }

            // Créer l'objet todo pour la mise à jour optimiste
            const score = importance * urgency - duration
            const todoData = {
                id: mode === "edit" ? id : Date.now(), // ID temporaire pour création
                title,
                importance,
                urgency,
                duration,
                score,
                created_at: mode === "create" ? new Date().toISOString() : todo?.created_at,
                updated_at: new Date().toISOString(),
                completed_at: todo?.completed_at || null,
            }

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
                    urgency,
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
                        <div>
                            <Label htmlFor="urgency">Urgence</Label>
                            <Input
                                ref={urgencyRef}
                                type="number"
                                id="urgency"
                                name="urgency"
                                defaultValue={todo?.urgency || 0}
                                min={0}
                                max={5}
                            />
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