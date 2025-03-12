"use client";

import { useState, useOptimistic, startTransition } from "react";
import { Skeleton } from "@/components/ui/skeleton"
import { type Todo } from "@/lib/db/schema"
import { toggleTodo } from "@/lib/db/queries";

export default function TodoDisplay({ todo }: { todo?: Todo }) {
    const [isToggled, setIsToggled] = useState(todo ? todo.completed_at !== null : false);
    async function toggle(todo: Todo) {
        startTransition(() => {
            toggleOptimistic(isToggled);
        });

        try {
            await toggleTodo(todo.id, isToggled);

            setIsToggled(!isToggled);
        } catch (error) {
            startTransition(() => {
                toggleOptimistic(isToggled);
            });
        }
    }

    const [optimisticState, toggleOptimistic] = useOptimistic(
        isToggled,
        (prev) => (
            !prev
        )
    )

    return (
        <>
            <input type="checkbox" className="hidden" name="taskButton" id="taskButton" onClick={
                () => {
                    if (todo) {
                        toggle(todo)
                    }
                }
            } />
            <label htmlFor="taskButton" className="flex space-x-1 items-center group">
                {
                    todo ? (
                        <div className={`relative p-2 size-1 border border-neutral rounded-300 ${optimisticState ? 'bg-primary' : ''}`}>
                            <div className={`absolute inset-0 w-1/2 h-1/2 z-20 m-auto duration-300 ${optimisticState ? 'lg:group-hover:bg-background' : 'lg:group-hover:bg-primary'}`} />
                        </div>
                    ) : (
                        <Skeleton className="w-5 h-5" />
                    )
                }
                {
                    todo ? (
                        <p className={`${optimisticState ? 'line-through' : ''}`}>
                            {todo.title}
                        </p>
                    ) : (
                        <Skeleton className="w-full h-4" />
                    )
                }
            </label>
        </>
    )
}