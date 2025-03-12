"use client"

import { Input } from "@/components/ui/input"
import { login } from "@/lib/auth/actions"
import { useActionState, useEffect, useState, useRef, startTransition } from "react"
import type { ActionState } from "@/middleware"

export default function Login() {
    // Initialize with default value
    const [redirectTo, setRedirectTo] = useState("/my")
    const [trial, setTrial] = useState("")
    const formRef = useRef<HTMLFormElement>(null)
    const [state, formAction] = useActionState<ActionState, FormData>(login, { error: "" })

    // Safely access location after component mounts on client
    useEffect(() => {
        // This code only runs in the browser
        const params = new URLSearchParams(window.location.search)
        const redirectParam = params.get("redirectTo")
        if (redirectParam) {
            setRedirectTo(redirectParam)
        }
    }, [])

    useEffect(() => {
        const handleKeyPress = (event: KeyboardEvent) => {
            if (event.key === "Enter") {
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

    return (
        <form
            action={formAction}
            ref={formRef}
            className="w-full min-h-screen flex flex-col space-y-4 items-center justify-center"
        >
            <h1 className="text-2xl">Hello</h1>
            <input type="text" name="redirectTo" className="hidden" value={redirectTo} readOnly />
            <Input
                type="password"
                name="password"
                className="max-w-16 text-center"
                value={trial}
                onChange={(e) => setTrial(e.target.value)}
            />
            {state?.error && <p className="text-red-500">{state.error}</p>}
            {state?.success && <p className="text-green-500">{state.success}</p>}
        </form>
    )
}

