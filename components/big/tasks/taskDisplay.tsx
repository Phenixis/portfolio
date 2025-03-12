"use client";

import { useState } from "react";
import { Skeleton } from "@/components/ui/skeleton"

export default function TaskDisplay({ title }: { title?: string }) {
    const [isToggled, setIsToggled] = useState(false);

    return (
        <>
            <input type="checkbox" className="hidden" name="taskButton" id="taskButton" onClick={
                () => setIsToggled(!isToggled)
            } />
            <label htmlFor="taskButton" className="flex space-x-1 items-center group">
                {
                    title ? (

                        <div className={`relative p-2 size-1 border border-neutral rounded-300 ${isToggled ? 'bg-primary' : ''}`}>
                            <div className={`absolute inset-0 w-1/2 h-1/2 z-20 m-auto duration-300 ${isToggled ? 'lg:group-hover:bg-background' : 'lg:group-hover:bg-primary'}`} />
                        </div>
                    ) : (
                        <Skeleton className="w-5 h-5" />
                    )
                }
                {
                    title ? (
                        <p className={`${isToggled ? 'line-through' : ''}`}>
                            {title}
                        </p>
                    ) : (
                        <Skeleton className="w-full h-4" />
                    )
                }
            </label>
        </>
    )
}