"use client"

import { Input } from "@/components/ui/input"
import { login } from "@/lib/auth/actions"
import { useActionState, useEffect, useState, useRef, startTransition } from "react"
import type { ActionState } from "@/middleware"
import { Loader } from "lucide-react"

export default function Login() {
    const [redirectTo, setRedirectTo] = useState("/my")
    const [trial, setTrial] = useState("")
    const formRef = useRef<HTMLFormElement>(null)
    const [state, formAction, pending] = useActionState<ActionState, FormData>(login, { error: "" })

    useEffect(() => {
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
            {
                pending ? (
                    <Loader className="animate-spin size-4" />
                ) : (
                    state?.error && <p className="text-red-500">{state.error}</p>
                )
            }
        </form>
    )
}

