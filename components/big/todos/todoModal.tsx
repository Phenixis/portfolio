"use client";

import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { type Todo } from "@/lib/db/schema";
import { createTodo, updateTodo } from "@/lib/db/queries";
import { PlusIcon, PenIcon, Loader } from "lucide-react";
import { startTransition, useActionState, useRef, useEffect, useState } from "react";
import { ActionState } from "@/middleware";

export function TodoModal({ className, todo }: { className?: string, todo?: Todo }) {
    const mode = todo ? 'edit' : 'create';
    const formRef = useRef<HTMLFormElement>(null)
    const [open, setOpen] = useState(false);

    async function formFunction(state: ActionState, form: FormData) {
        try {
            let result = null;

            if (mode === 'edit') {
                result = await updateTodo(parseInt(form.get('id') as string), form.get('title') as string, parseInt(form.get('importance') as string), parseInt(form.get('urgency') as string), parseInt(form.get('duration') as string));
            } else {
                result = await createTodo(form.get('title') as string, parseInt(form.get('importance') as string), parseInt(form.get('urgency') as string), parseInt(form.get('duration') as string));
            }

            if (result) {
                setOpen(false);
                return { success: "Mis à jour" }
            }
            return { error: "Erreur lors de la mise à jour" }
        } catch (error) {
            return { error: "" + error }
        }
    }

    const [state, formAction, pending] = useActionState<ActionState, FormData>(
        formFunction,
        { error: "" }
    );

    useEffect(() => {
        const handleKeyPress = (event: KeyboardEvent) => {
            if (event.ctrlKey && event.key === "Enter") {
                startTransition(() => {
                    if (formRef.current) {
                        formAction(new FormData(formRef.current))
                    }
                })
            }
        }

        document.addEventListener("keydown", handleKeyPress)

        return () => {
            document.removeEventListener("keydown", handleKeyPress)
        }
    }, [formAction])

    async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();

        startTransition(() => {
            if (formRef.current) {
                formAction(new FormData(formRef.current))
            }
        })
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger className={className}>
                {
                    mode === 'edit' ? (
                        <PenIcon className="size-4" />
                    ) : (
                        <PlusIcon className="size-6" />
                    )
                }
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>
                        {
                            mode === 'edit' ? (
                                'Edit Todo'
                            ) : (
                                'Create Todo'
                            )
                        }
                    </DialogTitle>
                </DialogHeader>
                <form ref={formRef} onSubmit={handleSubmit} className="space-y-4">
                    <input type="text" name="id" value={todo ? todo.id : ''} hidden readOnly />
                    <div>
                        <Label htmlFor="title">
                            Title
                        </Label>
                        <Input type="text" name="title" defaultValue={todo ? todo.title : ''} />
                    </div>
                    <div className="flex space-x-4">
                        <div>
                            <Label htmlFor="importance">
                                Importance
                            </Label>
                            <Input type="number" name="importance" defaultValue={todo ? todo.importance : 0} min={0} max={5} />
                        </div>
                        <div>
                            <Label htmlFor="urgency">
                                Urgency
                            </Label>
                            <Input type="text" name="urgency" defaultValue={todo ? todo.urgency : 0} min={0} max={5} />
                        </div>
                        <div>
                            <Label htmlFor="duration">
                                Duration
                            </Label>
                            <Input type="text" name="duration" defaultValue={todo ? todo.duration : 0} min={0} max={3} />
                        </div>
                    </div>
                    <DialogFooter className="flex flex-row items-center justify-between">
                        {
                            pending ? (
                                <Loader className="animate-spin size-4" />
                            ) : (
                                state?.error && <p className="text-red-500">{state.error}</p>
                            )
                        }
                        <Button type="submit">
                            {
                                mode === 'edit' ? (
                                    'Save'
                                ) : (
                                    'Create'
                                )
                            }
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}