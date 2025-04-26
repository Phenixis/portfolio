"use client"

import { Label } from "@/components/ui/label"
import { verifyCredentials } from "@/lib/auth/actions"
import { useActionState, useEffect, useState, useRef, startTransition } from "react"
import type { ActionState } from "@/middleware"
import { Loader } from "lucide-react"
import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
    InputOTP,
    InputOTPGroup,
    InputOTPSeparator,
    InputOTPSlot,
} from "@/components/ui/input-otp"
import {
    REGEXP_ONLY_DIGITS
} from "input-otp"

export default function Login() {
    const [redirectTo, setRedirectTo] = useState("/my")
    const [identifier, setIdentifier] = useState("")
    const [password, setPassword] = useState("")
    const [hiddenPassword, setHiddenPassword] = useState("")
    const formRef = useRef<HTMLFormElement>(null)
    const [state, formAction, pending] = useActionState<ActionState, FormData>((prevState, formData) => {
        formData.append("redirectTo", redirectTo)
        formData.append("identifier", identifier)
        formData.append("password", password)
        return verifyCredentials(prevState, formData)
    }, { error: "" })

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

    useEffect(() => {
        if (state?.success) {
            window.location.href = state.redirectTo;
        }
    }, [state]);

    return (
        <form
            action={formAction}
            ref={formRef}
            className="w-full min-h-screen flex flex-col space-y-4 items-center justify-center"
        >
            <Card>
                <CardHeader>
                    <CardTitle>Hello</CardTitle>
                </CardHeader>
                <CardContent>
                    <input type="text" name="redirectTo" className="hidden" value={redirectTo} readOnly />
                    <Label>Enter your identifier</Label>
                    <InputOTP
                        maxLength={8}
                        value={identifier}
                        onChange={(value) => setIdentifier(value)}
                        pattern={REGEXP_ONLY_DIGITS}
                    >
                        <InputOTPGroup>
                            <InputOTPSlot index={0} />
                            <InputOTPSlot index={1} />
                            <InputOTPSlot index={2} />
                            <InputOTPSlot index={3} />
                            <InputOTPSlot index={4} />
                            <InputOTPSlot index={5} />
                            <InputOTPSlot index={6} />
                            <InputOTPSlot index={7} />
                        </InputOTPGroup>
                    </InputOTP>
                    <Label>Enter your password</Label>
                    <InputOTP
                        type="password"
                        maxLength={8}
                        value={hiddenPassword}
                        onChange={(value) => {
                            if (value.length > password.length) {
                                const realValue = password + value.slice(-1)
                                const regex = /^\d*$/
                                if (regex.test(realValue)) {
                                    setPassword(realValue)
                                    setHiddenPassword("*".repeat(realValue.length))
                                }
                            } else {
                                setPassword(password.slice(0, value.length))
                                setHiddenPassword(value)
                            }
                        }}
                    >
                        <InputOTPGroup>
                            <InputOTPSlot index={0} />
                            <InputOTPSlot index={1} />
                            <InputOTPSlot index={2} />
                            <InputOTPSlot index={3} />
                            <InputOTPSlot index={4} />
                            <InputOTPSlot index={5} />
                            <InputOTPSlot index={6} />
                            <InputOTPSlot index={7} />
                        </InputOTPGroup>
                    </InputOTP>
                </CardContent>
                <CardFooter className={`${pending ? "flex justify-between" : "flex justify-end"}`}>
                    {
                        pending ? (
                            <Loader className="animate-spin size-4" />
                        ) : (
                            state?.error && <p className="text-red-500">{state.error}</p>
                        )
                    }
                    <Button
                        type="submit"
                        disabled={pending}
                    >Login</Button>
                </CardFooter>
            </Card>
        </form>
    )
}

