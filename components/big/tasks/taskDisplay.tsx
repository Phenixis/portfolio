"use client";

import { useState } from "react";

export default function TaskDisplay({ title }: { title?: string }) {
    const [isToggled, setIsToggled] = useState(false);

    return (
        <>
            <input type="checkbox" className="hidden" name="taskButton" id="taskButton" onClick={
                () => setIsToggled(!isToggled)
            } />
            <label htmlFor="taskButton" className="flex space-x-1 items-center group">
                <div className={`relative p-2 my-1 size-1 border border-neutral rounded-300 ${isToggled ? 'bg-primary' : ''}`}>
                    <div className={`absolute inset-0 w-1/2 h-1/2 z-20 m-auto duration-300 ${isToggled ? 'lg:group-hover:bg-background' : 'lg:group-hover:bg-primary'}`} />
                </div>
                <div>
                    <p className={`${isToggled ? 'line-through' : ''}`}>
                        {
                            title ? title : "Task"
                        }
                    </p>
                </div>
            </label>
        </>
    )
}